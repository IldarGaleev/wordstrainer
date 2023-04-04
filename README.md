# Тренажер слов

Закрепление изучаемых слов путем их вспоминания за ограниченное время.

## Как пользоваться?

1. Создайте `*.tsv` [файл](https://ru.wikipedia.org/wiki/TSV) со списком слов. Разделитель столбцов - символ табуляции. Первая строка содержит заголовок с именами столбцов (порядок не важен, неизвестные столбцы игнорируются. Столбцы `p` и `t` не обязательны):

Заголовок | Назначение
:--------:|-----------
`w`       | Слово
`p`       | Произношение (транскрипция)
`t`       | Перевод

[Пример файла](/words.tsv)

2. Кнопкой **"Слова"** ипортируйте созданный файл. Список слов сохранится в локальном хранилище браузера и будет доступен в дальнейшем

3. В поле слева от кнопки **"Начать"** укажите время обновления слов в секундах

4. Нажмите **"Начать"**

5. Ползунок под шкалой оставшегося времени задает момент отображения ответа (произношение и перевод)

6. Нажимайте клавишу **"Пробел"** на клавиатуре для слов, которые вы хотите повторить. Эти слова будут показаны повторно после того как будет выведен весь список слов.

7. Список слов будет циклически повторяться. Для прекращения нажмите **"Остановить"**

8. Список слов и настройки сохраняются локально в браузере

---

## Планируемые доработки

- Улучшить импорт `tsv`/`csv` файлов (добавить поддержку других форматов)
- Переработать пользовательский интерфейс
    - Добавить возможность изменять интервал "на лету"
    - Реализовать гибкий интервал - разное время в зависимости от длины слова/выражения
    - Переработать способ задания момента показа ответа
    - Добавить возможность редактировать список слов непосредственно на странице
- Добавить статистику слов
- Реализовать показ слов в соответствии с [кривой Эббингауза (кривой забывания)](https://ru.wikipedia.org/wiki/Кривая_забывания)
- Реализовать автономную работу web-приложения