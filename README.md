## Состав приложения
Проект состоит из 2-х проектов: backend и frontend. Backend реализован на Django, Frontend - на React.

### Структура проекта Backend

`backend/my_cloud` - корневой Django проект

`backend/my_cloud_admin` - проект, содержащий реализацию административной панели.

`backend/my_cloud_files` - проект, содержаший реализацию личного кабинета пользователя

`backend/my_cloud_models` - проект, содержащий модели данных, которые используются другими проектами

Бизнес-логика приложений `backend/my_cloud_admin` и `backend/my_cloud_files` располагается в файлах `api.py`

### Структура проекта Frontend

`frontend/src/features/adminWorkspace` - папка, содержащая реализацию административной панели.

`frontend/src/features/filesWorkspace` - папка, содержащаяреализацию личного кабинета пользователя

`frontend/src/features/common` - папка, содержащая общие компоненты/стили/хэлперы

### Описание развертывания сервера
### Подготавливаем окружение

    sudo apt-get update

    sudo apt-get install python3-pip python3-dev libpq-dev postgresql postgresql-contrib nginx


### Создаем пользователя под которым будем работать и запускать приложение
   ```
   adduser --home /home/<имя пользователя> <имя пользователя>
   
   chown -R <имя пользователя>:<имя группы_пользователя> /home/<имя пользователя>
   ```


### Создаем директорию под backend:
   
    cd /home/<имя пользователя>

    mkdir backend

    cd /home/<имя пользователя>/backend/
    

### Создаем БД в Pg
   
    sudo -u postgres psql

    CREATE DATABASE <имя БД>;

    CREATE USER <имя пользователя БД> WITH PASSWORD '<пароль пользователя БД>';

    GRANT ALL PRIVILEGES ON DATABASE <имя БД> TO <имя пользователя БД>;
    
    -l

    \q

БД создается с именем в нижнем регистре, нужно поменять имя БД и логин/пароль в файле settings.py

### Настройка окружения Python
   
    sudo -H pip3 install --upgrade pip

    sudo -H pip3 install virtualenv

    virtualenv venv

    source venv/bin/activate

### Установка пакетов приложения
 - Должно работать по классике:
   
        pip freeze > requirements.txt

        pip install -r requirements.txt

- Если выше не работает (For GCP VMs, using just pip will not work (you've to run it in sudo mode), it'll cause issue of permission error. So in case of GCP try this):

    sudo /home/backend/venv/bin/python -m pip install -r requirements.txt

- Или установить django + пакеты, которые задействованы в секции в settings.py

### Установка пакетов gunicorn и postgres
   
    pip install gunicorn psycopg2

### Мигрируем БД
   
    python manage.py migrate

### Открывем 8000 порт и проверяем, что приложение запускается (не обязательный пункт)

    sudo ufw allow 8000

    python manage.py runserver 0.0.0.0:8000

### Настраиваем gunicorn для работы приложения в фоновом режиме
    
Редактируем файл /etc/systemd/system/gunicorn.service:
    
    
    [Unit]
    Description=gunicorn daemon
    After=network.target

    [Service]
    User=<имя пользователя из п. 2>
    Group=<имя группы/пользователя из п. 2>
    WorkingDirectory=/home/<имя пользователя>/backend
    ExecStart=/home/<имя пользователя>/backend/venv/bin/gunicorn \
         --env DJANGO_SETTINGS_MODULE='<имя папки, где лежит файл settings.py>.settings' \
        --access-logfile /home/<имя пользователя>/backend/logs/gunicorn.log \
        --workers 3 --bind 127.0.0.1:8000 <имя папки, где лежит файл wsgi.py>.wsgi:application

    [Install]
    WantedBy=multi-user.target`

Возможно, потребуется создать папку с файлом `logs/gunicorn.log`

Стартуем сервис и проверям работоспособность:

    sudo systemctl daemon-reload

    sudo systemctl start gunicorn

    sudo systemctl enable gunicorn

    sudo systemctl status gunicorn


### Настраиваем фронт

    cd /home/<имя пользователя>

    mkdir frontend

Копируем файлы из локальной папки build на сервер `/home/<имя пользователя>/frontend/build`

### Конфигурируем nginx
    
Ищем и редактируем файл `/etc/nginx/sites-available/default`:

    server {
        root /home/<имя пользователя>/frontend/build;
        index index.html;
        server_name <ip адрес сервера>;

        location / {
            try_files $uri $uri/ /index.html =404;
        }

            location /<web адрес статиков> {
            autoindex on;
            alias /home/<имя пользователя>/backend/<физическое расположение статиков>;
        }

        location ~ ^/api {
            proxy_pass http://localhost:8000;
            proxy_set_header HOST $host;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }

    server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name 1**.**.**.*9;
        return 404;
    }

Перезапускаем nginx


    sudo nginx -t

    sudo systemctl restart nginx

    sudo ufw delete allow 8000
        
    sudo ufw allow 'Nginx Full'
