/**
 * ページ初期処理.
 */
functioninitializePage() {
    // カレンダーの設定
    $('#calendar').fullCalendar({
        height: 550,
        lang: "ja",
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,basicWeek,basicDay'
        },
        timeFormat: 'HH:mm',
        selectable: true,
        selectHelper: true,
        navLinks: true,
        eventSources: [{
            url: 'http://localhost:8080/getCalendar',
            dataType: 'json',
            async: false,
            type: 'GET',
            error: function() {
                $('#script-warning').show();
            }
        }],
        select: function(start, end, resource) {
            // 日付選択された際のイベント

            // タイトル初期化
            $("#inputTitle").val("");
            $('#inputScheduleForm').on('show.bs.modal', function(event) {
                setTimeout(function() {
                    $('#inputTitle').focus();
                }, 500);
            }).modal("show");

            // 日付ピッカーの設定
            $('.ymdHm').hide()
            $('#inputYmdFrom').datetimepicker({ locale: 'ja', format: 'YYYY年MM月DD日', useCurrent: false });
            $('#inputYmdTo').datetimepicker({ locale: 'ja', format: 'YYYY年MM月DD日', useCurrent: false });
            $('.ymdHm').datetimepicker({
                locale: 'ja',
                format: 'YYYY年MM月DD日 HH時mm分'
            });

            // 開始終了が逆転しないように制御
            $("#inputYmdFrom").on("dp.change", function(e) {
                $('#inputYmdTo').data("DateTimePicker").minDate(e.date);
            });
            $("#inputYmdTo").on("dp.change", function(e) {
                $('#inputYmdFrom').data("DateTimePicker").maxDate(e.date);
            });

            // 終日チェックボックス
            $('#allDayCheck').prop("checked", true);

            // 選択された日付をフォームにセット
            // FullCalendar の仕様で、終了が翌日の00:00になるため小細工
            varstartYmd = moment(start);
            varendYmd = moment(end);
            if (endYmd.diff(startYmd, 'days') > 1) {
                endYmd = endYmd.add(-1, "days");
            } else {
                endYmd = startYmd;
            }
            $('#inputYmdFrom').val(startYmd.format("YYYY年MM月DD日"));
            $('#inputYmdFrom').data("DateTimePicker").date(startYmd.format("YYYY年MM月DD日"));
            $('#inputYmdTo').val(endYmd.format("YYYY年MM月DD日"));
            $('#inputYmdTo').data("DateTimePicker").date(endYmd.format("YYYY年MM月DD日"));
        },
        eventClick: function(event) {
            // 予定クリック時のイベント
            console.log(event);
        },
        editable: true,
        eventLimit: true
    });
}

/**
 * 予定入力フォームの登録ボタンクリックイベント.
 */
functionregistSchedule() {

    varstartYmd = moment(formatNengappi($('#inputYmdFrom').val() + "00時00分00", 1));
    varendYmd = moment(formatNengappi($('#inputYmdTo').val() + "00時00分00", 1));
    varallDayCheck = $('#allDayCheck').prop("checked");
    if (!allDayCheck) {
        startYmd = moment(formatNengappi($('#inputYmdHmFrom').val() + "00", 1));
        endYmd = moment(formatNengappi($('#inputYmdHmTo').val() + "00", 1));
    }
    if (endYmd.diff(startYmd, 'days') > 0) {
        endYmd = endYmd.add(+1, "days");
    }

    vareventData;
    if ($('#inputTitle').val()) {
        eventData = {
            title: $('#inputTitle').val(),
            start: startYmd.format("YYYY-MM-DDTHH:mm:ss"),
            end: endYmd.format("YYYY-MM-DDTHH:mm:ss"),
            allDay: allDayCheck,
            description: $('#inputDescription').val()
        };
        $.ajax({
            url: "http://localhost:8080/regist",
            type: "POST",
            data: JSON.stringify(eventData),
            success: function(jsonResponse) {
                $('#calendar').fullCalendar('renderEvent', jsonResponse, true);
                alert("予定を登録しました。");
            },
            error: function() {}
        });
    }
    $('#calendar').fullCalendar('unselect');
}

/**
 * 終日チェックボックスクリックイベント.
 *
 */
functionallDayCheckClick(element) {
    if (element && element.checked) {
        $('.ymdHm').hide();
        $('.ymd').show();
    } else {
        varstartYmd = moment(formatNengappi($("#inputYmdFrom").val(), 0));
        varendYmd = moment(formatNengappi($("#inputYmdTo").val(), 0));
        varstartYmdHm = moment(startYmd.format("YYYY-MM-DD") + "T" + moment().format("HH") + ":00:00");
        varendYmdHm = moment(startYmd.format("YYYY-MM-DD") + "T" + moment().format("HH") + ":00:00").add(1, "hours");
        $("#inputYmdHmFrom").val(startYmdHm.format("YYYY年MM月DD日 HH時mm分"));
        $("#inputYmdHmTo").val(endYmdHm.format("YYYY年MM月DD日 HH時mm分"));

        $('.ymd').hide();
        $('.ymdHm').show();
    }
}

/**
 * 年月日の形式を変換する.
 */
functionformatNengappi(nengappi, flg) {
    varret = nengappi.replace("年", "-").replace("月", "-").replace("日", "");
    if (flg == 1) {
        ret = nengappi.replace("年", "-").replace("月", "-").replace("日", "T").replace("時", ":").replace("分", ":").replace(" ", "");
    }
    returnret;
}