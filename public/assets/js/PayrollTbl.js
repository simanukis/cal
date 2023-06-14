// 繰り返し使うtableだけ先に定数に格納
const tbl = document.getElementById("tbl");

// 行追加
function add() {
    // 空の行要素を先に作成<tr></tr>
    let tr = document.createElement("tr");

    // 以下繰り返し処理
    for (let i = 0; i < 8; i++) {
        let td = document.createElement("td"); // 新しいtd要素を作って変数tdに格納
        let inp = document.createElement("input"); // tdにinput追加
        td.appendChild(inp); //tdにinpを追加
        tr.appendChild(td); //trにtdを追加
    }

    // 完成したtrをtableに追加
    tbl.appendChild(tr);
}

//以下、末尾行削除処理
function del() {
    let rw = tbl.rows.length; //行数取得
    tbl.deleteRow(rw - 1); //最終行を指定して削除
}