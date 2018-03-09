import pymysql
import math

db_config = {
    'user': 'root',
    'password': 'qwe123',
    'db': 'test01',
    'charset': 'utf8'
}
class Paging:
    def __init__(self,db_cfg):
        self.db_cfg = db_cfg
        self.pages = self.pages()
    def pages(self):
        conn = pymysql.connect(**self.db_cfg)
        try:
            cur = conn.cursor()
            cur.execute('SELECT COUNT(*) FROM students_1')
            res = cur.fetchall()
        except Exception as e:
            print(e)
            conn.rollback()
        finally:
            conn.commit()
            cur.close()
            conn.close()
        return math.ceil(res[0][0]/3)
    def Input(self):
        num = input('请输入页数：')
        if num.isdigit() and int(num) > 0 and int(num) <= self.pages:
            conn = pymysql.connect(**self.db_cfg)
            try:
                cur = conn.cursor()
                cur.execute( 'SELECT * FROM students_1 LIMIT {},3'.format( (int(num)-1)*3 ) )
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

        else:
            print('请输入0-{}的整数'.format(self.pages))
            self.Input()
Pag = Paging(db_config)
Pag.Input()