(function(namespace, $) {
    "use strict";

    var DemoCalendar = function() {
        // このインスタンスへの参照を作成
        var o = this;
        // ドキュメントの準備ができたらアプリを初期化する
        $(document).ready(function() {
            o.initialize();
        });

    };
    var p = DemoCalendar.prototype;

    // =========================================================================
    // 初期化
    // =========================================================================

    p.initialize = function() {
        this._enableEvents();

        this._initEventslist();
        this._initCalendar();
        this._displayDate();
    };

    // =========================================================================
    // EVENTS
    // =========================================================================

    // events
    p._enableEvents = function() {
        var o = this;

        $('#calender-prev').on('click', function(e) {
            o._handleCalendarPrevClick(e);
        });
        $('#calender-next').on('click', function(e) {
            o._handleCalendarNextClick(e);
        });
        $('.nav-tabs li').on('show.bs.tab', function(e) {
            o._handleCalendarMode(e);
        });
    };

    // =========================================================================
    // CONTROLBAR
    // =========================================================================

    p._handleCalendarPrevClick = function(e) {
        $('#calendar').fullCalendar('prev');
        this._displayDate();
    };
    p._handleCalendarNextClick = function(e) {
        $('#calendar').fullCalendar('next');
        this._displayDate();
    };
    p._handleCalendarMode = function(e) {
        $('#calendar').fullCalendar('changeView', $(e.currentTarget).data('mode'));
    };

    p._displayDate = function() {
        var selectedDate = $('#calendar').fullCalendar('getDate');
        $('.selected-day').html(moment(selectedDate).format("dddd"));
        $('.selected-date').html(moment(selectedDate).format("DD MMMM YYYY"));
        $('.selected-year').html(moment(selectedDate).format("YYYY"));
    };

    // =========================================================================
    // TASKLIST
    // =========================================================================

    p._initEventslist = function() {
        if (!$.isFunction($.fn.draggable)) {
            return;
        }
        var o = this;

        $('.list-events li ').each(function() {
            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var eventObject = {
                title: $.trim($(this).text()), // use the element's text as the event title
                className: $.trim($(this).data('className'))
            };

            // store the Event Object in the DOM element so we can get to it later
            $(this).data('eventObject', eventObject);

            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 999,
                revert: true, // will cause the event to go back to its
                revertDuration: 0, //  original position after the drag
            });
        });
    };

    // =========================================================================
    // CALENDAR
    // =========================================================================

    p._initCalendar = function(e) {
        if (!$.isFunction($.fn.fullCalendar)) {
            return;
        }

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        $('#calendar').fullCalendar({
            locale: 'pt-br',
            height: 700,
            header: false,
            editable: true,
            droppable: true,
            selectable: true,
            selectHelper: true,

            ignoreTimezone: false,
            monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            dayNames: ['日', '月', '火', '水', '木', '金', '土'],
            dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            titleFormat: {
                month: 'MMMM yyyy',
                week: "d[ MMMM][ yyyy]{ - d MMMM yyyy}",
                day: 'dddd, d MMMM yyyy'
            },

            columnFormat: {
                month: 'ddd',
                week: 'ddd d',
                day: ''
            },

            axisFormat: 'H:mm',
            timeFormat: {
                '': 'H:mm',
                agenda: 'H:mm{ - H:mm}'
            },

            buttonText: {
                prev: "&nbsp;&#9668;&nbsp;",
                next: "&nbsp;&#9658;&nbsp;",
                prevYear: "&nbsp;&lt;&lt;&nbsp;",
                nextYear: "&nbsp;&gt;&gt;&nbsp;",
                today: "今日",
                month: "月",
                week: "週",
                day: "日",
                list: "一覧"
            },



            drop: function(date, allDay) { // この関数は何かがドロップされたときに呼び出される
                // ドロップされた要素の格納されたイベントオブジェクトを格納する
                var originalEventObject = $(this).data('eventObject');

                // we need to copy it, so that multiple events don't have a reference to the same object
                var copiedEventObject = $.extend({}, originalEventObject);

                // assign it the date that was reported
                copiedEventObject.start = date;
                copiedEventObject.allDay = allDay;
                copiedEventObject.className = originalEventObject.className;

                // render the event on the calendar
                // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

                // is the "remove after drop" checkbox checked?
                if ($('#drop-remove').is(':checked')) {
                    // if so, remove the element from the "Draggable Events" list
                    $(this).remove();
                }
            },

            //LISTA DE EVENTOS
            events: '/api/bookings/',


            eventClick: function(event, jsEvent, view) {
                $('#visualizar_agenda #title').text(event.title);
                $('#visualizar_agenda #start').text(event.start.format('DD/MM/YYYY HH:mm:ss'));
                $('#visualizar_agenda #end').text(event.end.format('DD/MM/YYYY HH:mm:ss'));
                $('#visualizar_agenda').modal('show');
                return false;
            },

            select: function(start, end) {
                $.ajax({
                    url: '/bookings/agendamento/novo/',
                    type: 'get',
                    dataType: 'json',
                    beforeSend: function() {
                        //$("#cadastrar_agenda .modal-content").html("");
                        $("#cadastrar_agenda").modal("show");
                    },
                    success: function(data) {
                        $("#cadastrar_agenda .modal-content").html(data.html_form);
                    }
                });

                var form = $(this);

                $.ajax({
                    url: form.attr('data-url'),
                    data: form.serialize(),
                    type: form.attr('method'),
                    dataType: 'json',
                    success: function(data) {
                        if (data.form_is_valid) {
                            console.log('Dados salvos')
                        } else {
                            $('#cadastrar_agenda .modal-content').html(data.html_form)
                        }
                    }
                })
                return false;
            },

            eventDrop: function(event, delta) {
                $.ajax({
                    type: "PUT",
                    url: '/api/bookings/' + event.id + '/edit/',
                    data: {

                        //user: event.user,
                        title: event.title,
                        start: event.start.format('L'),
                        end: event.end.format('L'),
                        all_day: true,
                        color: event.color,
                        editable: event.editable
                    },
                    success: function(json) {
                        alert(event.title + " foi modificado para data " + event.start.format('L'));
                    }
                });
            },


            eventResize: function(event) {
                $.ajax({
                    type: "PUT",
                    url: '/api/bookings/' + event.id + '/edit/',
                    data: {

                        //user: event.user,
                        title: event.title,
                        start: event.start.format(),
                        end: event.end.format(),
                        all_day: true,
                        color: event.color,
                        editable: event.editable,
                    },
                    success: function(json) {
                        alert(event.title + " foi modificado para data " + event.start.format('L'));
                    }
                });

            },

            //			eventRender: function (event, element) {
            //				element.find('#date-title').html(element.find('span.fc-event-title').text());
            //			}

            eventRender: function(event, element) {
                $(element).popover({ title: event.title, content: 'Inicia em: ' + event.start.format('DD/MM/YYYY HH:mm:ss') + ' termina em: ' + event.end.format('DD/MM/YYYY HH:mm:ss'), trigger: 'hover' });

            }
        });


        var days = []

        $.get("/api/bookings/feriado/", function(data) {


            $.each(data, function(index, value) {

                //alert(value.start.substr(0, 10))
                days.push(value.start.substr(0, 10))

            });


            $("td, th").each(function() {
                if (days.indexOf(this.dataset.date) >= 0) {
                    $(this).css("background-color", "red");
                }
            });

        });

    };

    // =========================================================================
    namespace.DemoCalendar = new DemoCalendar;
}(this.materialadmin, jQuery)); // pass in (namespace, jQuery):