import datetime

utc_08 = datetime.timezone(datetime.timedelta(hours=8),'Asia/Beijing')
utc_ns_08 = datetime.timezone(datetime.timedelta(hours=-8),'America/Los_Angelse')
def utc_now():
    dt = datetime.datetime.utcnow()
    utc_dt = datetime.datetime(dt.year,dt.month,dt.day,dt.hour,dt.minute,dt.second,tzinfo=datetime.timezone.utc)
    return utc_dt

us_dt = utc_now().astimezone(utc_ns_08)
cn_dt = utc_now().astimezone(utc_08)
print(us_dt)
print(cn_dt)