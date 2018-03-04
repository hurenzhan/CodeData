import pymysql

db_config = {
    'user': 'root',
    'password': 'qwe123',
    'db': 'python3',
    'charset': 'utf8'
}
conn = pymysql.connect(**db_config)
try:
    cur = conn.cursor()
    # cur.execute('CREATE TABLE teacher('
    #                 'number CHAR (9),'
    #                 'name VARCHAR (29),'
    #                 'length INT,'
    #                 'birth DATE'
    #             ');')
    # sql = 'INSERT INTO teacher VALUE ({},{},{},{})'.format('"000000000"','"null"',0,'"0000-00-00"')
    cur.execute(' DELETE FROM teacher')
    cur.execute("INSERT INTO teacher VALUE ('c20180304','Tuple',6,'2012-10-10'),('c20180304','nya',18,'2000-06-06')")
    cur.execute('SELECT * FROM teacher')
    res = cur.fetchall()
    for i in res:
        print(i)
except Exception as e:
    print(e)
    conn.rollback()
finally:
    conn.commit()
    cur.close()
    conn.close()