var Mines = 60; // 地雷數量
var Rows = 20; // 方格大小
var Cells = new Array(Rows); // 記錄每一個格子的內容
var Timer;
var TimerNo = 0;
var MinesDisplayed;

function Initialize() {
    $('#main').html('');
    MinesDisplayed = Mines
    $('#MinesLeft').text(pad(MinesDisplayed, 3));
    clearInterval(Timer);
    TimerNo = 0;
    Timer = setInterval(() => {
        TimerNo++;
        $('#Timer').text(pad(TimerNo, 4));
    }, 1000);
    let LeftedMines = Mines;
    for (i = 0; i < Rows; i++) {
        Cells[i] = new Array(Rows); // 產生二維陣列
        for (j = 0; j < Rows; j++) {
            Cells[i][j] = {
                IsOpen: false,
                IsMine: false,
                IsFlag: false,
                MinesNext: 0
            };
            $('#main').append("<div id='cell" + i + "_" + j + "' class='cell'><label></label></div>");
        }
        $('#main').append("<br/>");
    }

    for (; LeftedMines > 0;) {
        let X = Math.floor(Math.random() * Rows);
        let Y = Math.floor(Math.random() * Rows);
        // 判斷是否已經有地雷了
        if (!Cells[X][Y].IsMine) {
            Cells[X][Y].IsMine = true;
            LeftedMines--;
            //$('#cell' + X + "_" + Y).html("<i class='fas fa-bomb' style='color:#64363C'></i>")
            // 計算隔壁格子的地雷數量
            CalculateCell(X - 1, Y - 1);
            CalculateCell(X, Y - 1);
            CalculateCell(X + 1, Y - 1);
            CalculateCell(X - 1, Y);
            CalculateCell(X + 1, Y);
            CalculateCell(X - 1, Y + 1);
            CalculateCell(X, Y + 1);
            CalculateCell(X + 1, Y + 1);
        }
    }

    $('.cell').on('mousedown', (event) => {
        var Temp = event.target.id.substr(4);
        var Temp2 = Temp.split('_');
        var X = parseInt(Temp2[0]),
            Y = parseInt(Temp2[1]);
        if (!Cells[X][Y].IsOpen) {
            if (event.which == 3) { // 滑鼠右鍵
                if (!Cells[X][Y].IsFlag) {
                    Cells[X][Y].IsFlag = true;
                    $('#cell' + X + "_" + Y).html("<i class='fas fa-flag' style='color:blue'></i>")
                    MinesDisplayed--
                    $('#MinesLeft').text(pad(MinesDisplayed, 3));
                    if (MinesDisplayed == 0) {
                        var IsWin = true;
                        for (i = 0; i < Rows; i++) {
                            for (j = 0; j < Rows; j++) {
                                if (!Cells[i][j].IsOpen && !Cells[i][j].IsFlag)
                                    IsWin = false;
                            }
                        }
                        if (IsWin) {
                            alert('Congratualation');
                            clearInterval(Timer);
                            $('.cell').off('mousedown');
                        }
                    }
                } else {
                    Cells[X][Y].IsFlag = false;
                    $('#cell' + X + "_" + Y).html("<label></label>");
                    MinesDisplayed++
                    $('#MinesLeft').text(pad(MinesDisplayed, 3));
                }

            } else {
                Cells[X][Y].IsOpen = true;
                $('#cell' + X + '_' + Y).removeClass('cell').addClass('cellopen');
                if (Cells[X][Y].IsMine) {
                    for (i = 0; i < Rows; i++) {
                        for (j = 0; j < Rows; j++) {
                            if (Cells[i][j].IsMine) {
                                $('#cell' + i + "_" + j).html("<i class='fas fa-bomb' style='color:#64363C'></i>");
                            }
                        }
                    }
                    alert('遊戲結束');
                    clearInterval(Timer);
                    $('.cell').off('mousedown'); // 清楚事件 把滑鼠點下去的事件取消 
                } else {
                    if (Cells[X][Y].MinesNext == 0) {
                        Cells[X][Y].IsOpen = false; // 先設定回來 底下的會檢查是否打開 可是之前已經設定為打開了
                        OpenCell(X, Y);
                    } else {
                        $('#cell' + X + "_" + Y).html("<i class='' style='color:blue'>" + Cells[X][Y]
                            .MinesNext + "</i>")
                    }
                }
            }
        }
    })
}
// 計算X,Y所在格子的隔壁地雷數量
function CalculateCell(X, Y) {
    if (X >= 0 && Y >= 0 && X < Rows && Y < Rows) {
        if (!Cells[X][Y].IsMine) {
            Cells[X][Y].MinesNext++;
            //$('#cell' + x + "_" + y).html("<i class='' style='color:blue'>" + Cells[X][Y].MinesNext + "</i>")
        }
    }
}
// 補0
function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
}
// 開啟 x,y所在格字直到數字
function OpenCell(X, Y) {
    if (X >= 0 && Y >= 0 && X < Rows && Y < Rows) {
        if (Cells[X][Y].IsOpen)
            return; //底下不在執行
        Cells[X][Y].IsOpen = true; //設定成已經翻開了
        if (Cells[X][Y].MinesNext > 0) {
            $('#cell' + X + "_" + Y).removeClass('cell').addClass('cellopen').html("<i style='color:blue'>" + Cells[X][Y].MinesNext + "</i>")
        } else if (Cells[X][Y].MinesNext == 0) {
            $('#cell' + X + '_' + Y).removeClass('cell').addClass('cellopen');
            // 空白的話往隔壁繼續翻
            OpenCell(X - 1, Y - 1);
            OpenCell(X, Y - 1);
            OpenCell(X + 1, Y - 1);
            OpenCell(X - 1, Y);
            OpenCell(X + 1, Y);
            OpenCell(X - 1, Y + 1);
            OpenCell(X, Y + 1);
            OpenCell(X + 1, Y + 1);
        }
    }
}



$(() => {
    document.addEventListener('contextmenu', event => event.preventDefault()); //讓滑鼠右鍵不要顯示原先的選單
    $('#start').on('click', (event) => {
        Initialize();
    })

});