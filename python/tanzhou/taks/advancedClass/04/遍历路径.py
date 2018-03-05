import os
def all_cwd(path):
    for i in os.listdir(path):
        pJoin = os.path.join(path,i)
        if os.path.isdir(pJoin):
            all_cwd(pJoin)
        else:
            print(pJoin)

all_cwd('/home/pyvip/CodeDeta/python/tanzhou/taks')

