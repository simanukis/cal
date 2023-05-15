// CSRF対策
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
axios.defaults.xsrfCookieName = "csrftoken"

document.addEventListener('DOMContentLoaded', function() {

    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        themeSystem: 'bootstrap5',
        locale: 'ja', // 日本語化
        buttonText: {
            prev: '前月',
            next: '翌月',
            today: '今日',
            dayGridMonth: '月',
            timeGridWeek: '週',
            timeGridDay: '日',
            listMonth: '一覧'
        },
        headerToolbar: { // ヘッダーに表示する内容を指定
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        },

        dayCellContent: function(e) {
            e.dayNumberText = e.dayNumberText.replace('日', '');
        },

        // 日付をクリック、または範囲を選択したイベント
        selectable: true,
        editable: true, // イベントを編集

        select: function(info) {
            // alert("selected " + info.startStr + " to " + info.endStr);

            // 入力ダイアログ
            const eventName = prompt("予定を入力してください");

            if (eventName) {

                // 登録処理の呼び出し
                axios
                    .post("/scheduleCalendar/add/", {
                        start_date: info.start.valueOf(),
                        end_date: info.end.valueOf(),
                        event_name: eventName,
                    })
                    .then(() => {
                        // イベントの追加
                        calendar.addEvent({
                            title: eventName,
                            start: info.start,
                            end: info.end,
                            allDay: true,
                        });
                    })
                    .catch(() => {
                        // バリデーションエラーなど
                        alert("登録に失敗しました");
                    });
            }
        },
        events: function(info, successCallback, failureCallback) {
            axios
                .post("/scheduleCalendar/list/", {
                    start_date: info.start.valueOf(),
                    end_date: info.end.valueOf(),
                })
                .then((response) => {
                    calendar.removeAllEvents();
                    successCallback(response.data);
                })
                .catch(() => {
                    // バリデーションエラーなど
                    alert("登録に失敗しました");
                });
        },
        eventClick: function(info) { // イベントをクリックした時に走るメソッド
            alert('Event: ' + info.event.title);
            alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
            alert('View: ' + info.view.type);

            // change the border color just for fun
            info.el.style.borderColor = 'red';
        }
    });

    calendar.render();
});