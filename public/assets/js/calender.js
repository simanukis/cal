(function() {
    $(function() {
        // ドラックボックスのエレメントを取得
        var containerEl = $('#external-events-list')[0];
        // ドラックボックスを生成する。
        new FullCalendar.Draggable(containerEl, {
            itemSelector: '.fc-event',
            eventData: function(eventEl) {
                return {
                    title: eventEl.innerText.trim()
                }
            }
        });
        // ドラックイベントを追加
        for (var i = 1; i <= 5; i++) {
            var $div = $("<div class='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'></div>");
            $event = $("<div class='fc-event-main'></div>").text("アクアグレー " + i);
            $('#external-events-list').append($div.append($event));
        }
        // calendarエレメント取得
        var calendarEl = $('#calendar1')[0];
        // full-calendar生成する。
        var calendar = new FullCalendar.Calendar(calendarEl, {
            // ヘッダーに表示するツールバー
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            },
            // initialDate: '', // 初期日付設定(設定しなければ基本的に本日の日付で設定)
            locale: 'ja', // 日本語設定
            editable: true, // 修正可能
            droppable: true, // ドラック可能
            drop: function(arg) { // ドラッグアンドドロップが成功する場合
                // ドラックボックスでイベントを削除する。
                arg.draggedEl.parentNode.removeChild(arg.draggedEl);
            }
        });
        // カレンダーレンダリング
        calendar.render();
    });
})();