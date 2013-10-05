basket_rush_server
===========

2ida team's app. Collaborative family shopping list

API URI's:

    * Добавить id push-нотификации: /users/set_push_id (push_id)
    * Добавить элемент в список: /users/additem (data[title], data[count], data[photo])
    * Получить список: /users/list
    * Зарегать юзера: /users/create (login, gender, partner_login)

    Все адреса, кроме /users/create просят дополнительных двух полей: login и secret - для авторизации пользователя
Install & Run:

    * sudo apt-get install mongodb
    * 
