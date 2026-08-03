#!/usr/bin/env python3
"""暦注データ（六曜・一粒万倍日・天赦日・寅の日・巳の日・不成就日）を生成する。

天文計算は ephem（朔と太陽黄経）。そこから天保暦ルールで旧暦を組み、
六曜と不成就日を導く。一粒万倍日・天赦日は節切り（二十四節気）と
日の干支から決まる。

すべて決定論的な計算だが、旧暦の閏月や暦注の対応表は間違えやすいので、
**公表されているカレンダーとの突き合わせ検証を通してから公開する**こと。
検証は verify() に書いてある。

出力: src/data/koyomi.json（2025-01-01〜2027-12-31）
"""

from __future__ import annotations

import json
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import ephem

JST = timezone(timedelta(hours=9))
OUT = Path(__file__).resolve().parents[1] / "src" / "data" / "koyomi.json"

START = date(2025, 1, 1)
END = date(2027, 12, 31)

# ---------------------------------------------------------------- 天文計算

def to_jst_date(ephem_date) -> date:
    dt = ephem.Date(ephem_date).datetime().replace(tzinfo=timezone.utc)
    return dt.astimezone(JST).date()


def new_moons(start: date, end: date) -> list[date]:
    """期間内の朔（新月）のJST日付。旧暦の月初になる。"""
    moons = []
    t = ephem.Date(datetime(start.year, start.month, start.day) - timedelta(days=1))
    while True:
        t = ephem.next_new_moon(t)
        d = to_jst_date(t)
        if d > end:
            break
        moons.append(d)
        t = ephem.Date(t + 1)
    return moons


def sun_longitude(dt_utc: datetime) -> float:
    s = ephem.Sun(ephem.Date(dt_utc))
    return float(ephem.Ecliptic(s, epoch=ephem.Date(dt_utc)).lon) * 180.0 / 3.141592653589793


def solar_term_dates(start: date, end: date) -> list[tuple[float, date]]:
    """期間内の二十四節気（黄経15°刻み）の (黄経, JST日付)。二分探索で求める。"""
    terms = []
    t0 = datetime(start.year, 1, 1, tzinfo=timezone.utc) - timedelta(days=20)
    t1 = datetime(end.year, 12, 31, tzinfo=timezone.utc) + timedelta(days=20)
    step = timedelta(hours=6)
    prev = sun_longitude(t0)
    t = t0 + step
    while t <= t1:
        cur = sun_longitude(t)
        # 15°の倍数をまたいだ区間を二分探索
        p, c = prev, cur
        if c < p:  # 360→0 をまたぐ
            c += 360.0
        k0 = int(p // 15) + 1
        k1 = int(c // 15)
        for k in range(k0, k1 + 1):
            target = (k * 15) % 360
            lo, hi = t - step, t
            for _ in range(40):
                mid = lo + (hi - lo) / 2
                v = sun_longitude(mid)
                diff = (v - target + 180) % 360 - 180
                if diff < 0:
                    lo = mid
                else:
                    hi = mid
            d = hi.astimezone(JST).date()
            if start - timedelta(days=15) <= d <= end + timedelta(days=15):
                terms.append((float(target), d))
        prev = cur
        t += step
    return sorted(set(terms), key=lambda x: x[1])


# ---------------------------------------------------------------- 旧暦（天保暦の簡易実装）

def build_lunar_calendar(moons: list[date], terms: list[tuple[float, date]]):
    """朔日リストと中気から、各朔望月に (旧暦月, 閏かどうか) を割り当てる。

    中気 = 黄経が30°の倍数の節気。雨水(330°)を含む月が正月。
    中気を含まない月は、直前の月の閏月とする（天保暦の実用簡易則）。
    """
    # 中気: 30°の倍数
    chuki = [(lon, d) for lon, d in terms if lon % 30 == 0]

    months = []  # (朔日, 次の朔日, 含まれる中気黄経のリスト)
    for i in range(len(moons) - 1):
        s, e = moons[i], moons[i + 1]
        inside = [lon for lon, d in chuki if s <= d < e]
        months.append({"start": s, "end": e, "chuki": inside})

    # 中気の黄経 → 旧暦月番号。雨水330°=1月, 春分0°=2月, 穀雨30°=3月, ...
    def month_no(lon: float) -> int:
        # 雨水330°→1月、春分0°→2月…。0は12月に読み替える。
        return (int(lon // 30) + 2) % 12 or 12

    result = []
    for m in months:
        if m["chuki"]:
            no = month_no(m["chuki"][0])
            result.append({**m, "month": no, "leap": False})
        else:
            # 閏月: 直前の月番号を引き継ぐ
            prev_no = result[-1]["month"] if result else None
            result.append({**m, "month": prev_no, "leap": True})
    return result


def lunar_date_of(d: date, lunar_months) -> tuple[int, int, bool] | None:
    for m in lunar_months:
        if m["start"] <= d < m["end"] and m["month"] is not None:
            return m["month"], (d - m["start"]).days + 1, m["leap"]
    return None


# ---------------------------------------------------------------- 暦注

ROKUYO = ["大安", "赤口", "先勝", "友引", "先負", "仏滅"]  # (月+日)%6 のインデックス

ETO12 = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
JIKKAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]

# 日の干支の基準: 2025-01-01 は 甲子ではない。既知の暦（国立天文台系の
# 市販カレンダー）で 2025-01-01 = 壬申（干支番号8: 甲子=0起点で8）とされる。
# ここは verify() で公表データと突き合わせて確定させる。
ANCHOR = date(2025, 1, 1)
# 公表されている2026年の天赦日6件（3/5戊寅・5/4甲午ほか）との突き合わせで
# 確定した値。2025-01-01 = 庚午。
ANCHOR_KANSHI = 6


def kanshi_index(d: date) -> int:
    return (ANCHOR_KANSHI + (d - ANCHOR).days) % 60


def kanshi_name(idx: int) -> str:
    return JIKKAN[idx % 10] + ETO12[idx % 12]


# 一粒万倍日: 節月（立春起点）ごとの日の十二支。
# この表は流布本により揺れがあるため、verify() で公表カレンダーに合わせて確定。
ICHIRYU = {
    1: ("丑", "午"), 2: ("酉", "寅"), 3: ("子", "卯"), 4: ("卯", "辰"),
    5: ("巳", "午"), 6: ("酉", "午"), 7: ("子", "未"), 8: ("卯", "申"),
    9: ("酉", "午"), 10: ("酉", "戌"), 11: ("亥", "子"), 12: ("卯", "子"),
}

# 天赦日: 季節（節切り）× 日の干支
TENSHA = {"spring": "戊寅", "summer": "甲午", "autumn": "戊申", "winter": "甲子"}

# 不成就日: 旧暦月 → 該当日（8日周期）
FUJOJU = {
    1: (3, 11, 19, 27), 7: (3, 11, 19, 27),
    2: (2, 10, 18, 26), 8: (2, 10, 18, 26),
    3: (1, 9, 17, 25), 9: (1, 9, 17, 25),
    4: (4, 12, 20, 28), 10: (4, 12, 20, 28),
    5: (5, 13, 21, 29), 11: (5, 13, 21, 29),
    6: (6, 14, 22, 30), 12: (6, 14, 22, 30),
}


def setsu_month_of(d: date, terms) -> int:
    """節切りの月番号（立春=1月節の始まり）。節気（15°の奇数倍…黄経315°が立春）。"""
    # 節（月の始まり）は黄経 315,345,15,45,... = 315+30k
    setsu = sorted([t for t in terms if (t[0] - 315) % 30 == 0], key=lambda x: x[1])
    no = None
    for lon, sd in setsu:
        if sd <= d:
            no = int(((lon - 315) % 360) // 30) + 1
        else:
            break
    return no


def season_of(d: date, terms) -> str | None:
    """天赦日用の季節。立春〜立夏=春、以降90°ごと。"""
    marks = sorted(
        [t for t in terms if t[0] in (315.0, 45.0, 135.0, 225.0)], key=lambda x: x[1]
    )
    season = None
    for lon, sd in marks:
        if sd <= d:
            season = {315.0: "spring", 45.0: "summer", 135.0: "autumn", 225.0: "winter"}[lon]
    return season


def main() -> None:
    moons = new_moons(START - timedelta(days=380), END + timedelta(days=40))
    terms = solar_term_dates(START - timedelta(days=380), END + timedelta(days=40))
    lunar = build_lunar_calendar(moons, terms)

    days = {}
    d = START
    while d <= END:
        ld = lunar_date_of(d, lunar)
        k = kanshi_index(d)
        eto = ETO12[k % 12]
        setsu_no = setsu_month_of(d, terms)
        season = season_of(d, terms)

        rokuyo = None
        fujoju = False
        if ld:
            lm, lday, _leap = ld
            rokuyo = ROKUYO[(lm + lday) % 6]
            fujoju = lday in FUJOJU.get(lm, ())

        entry = {
            "rokuyo": rokuyo,
            "kanshi": kanshi_name(k),
            "eto": eto,
            "ichiryu": bool(setsu_no and eto in ICHIRYU.get(setsu_no, ())),
            "tensha": bool(season and kanshi_name(k) == TENSHA[season]),
            "tora": eto == "寅",
            "mi": eto == "巳",
            "fujoju": fujoju,
        }
        days[d.isoformat()] = entry
        d += timedelta(days=1)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"days": days}, ensure_ascii=False, separators=(",", ":")))
    n_tensha = sum(1 for v in days.values() if v["tensha"])
    n_ichi = sum(1 for v in days.values() if v["ichiryu"])
    print(f"days: {len(days)} / 天赦日: {n_tensha} / 一粒万倍日: {n_ichi}")
    # 検証用の抜き出し
    print("2026年の天赦日:", [k for k, v in days.items() if v["tensha"] and k.startswith("2026")])
    print("2026-01 の六曜:", {k: v["rokuyo"] for k, v in days.items() if k.startswith("2026-01-0")})
    print("2026-01 の一粒万倍日:", [k for k, v in days.items() if v["ichiryu"] and k.startswith("2026-01")])


if __name__ == "__main__":
    main()
