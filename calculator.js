const armyBtn = $(".armyBtn");

// army 버튼이 클릭되어있는데 클릭했을시 색변경과 버튼 클릭 유무 
function handleClick(event) {
    if (event.target.classList[1] === "clicked") {
        event.target.classList.remove("clicked");
        armyBtn.style.backgroundColor = "#E2E2E2";
        armyBtn.style.color = "black";
    } else {
        for (let i = 0; i < armyBtn.length; i++) {
            armyBtn[i].classList.remove("clicked");
        }
    }
    event.target.classList.add("clicked");
}

// army 버튼 목록 중, clicked가 달린 버튼을 찾아내어서 그 버튼의 text값을 리턴함.
function getSelected() {
    for (let item of armyBtn) // for of 구문에 관한 문서: https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/for...of
        if (item.className.includes("clicked")) {
            return item.value;
        }
    return "";
}

function init() {
    for (let i = 0; i < armyBtn.length; i++) {
        armyBtn[i].addEventListener("click", handleClick);
    }
}

// https://stackoverflow.com/questions/2627473/how-to-calculate-the-number-of-days-between-two-dates
function dayBetweenDate(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

    const diffDays = Math.round(Math.abs((date1 - date2) / oneDay));
    return diffDays;
}

/* var변수를 let으로 바꾼 이유:
       https://velog.io/@bathingape/JavaScript-var-let-const-%EC%B0%A8%EC%9D%B4%EC%A0%90
                */
$(document).ready(function () {
    $("#datepicker").datepicker({
        dateFormat: "yy-mm-dd",
        showOn: "button",
        buttonText: "입대일",
        onSelect: function (dateText, inst) {
            const targetText = getSelected(); // calculator.js에서 선언

            if (targetText === "") {
                alert("복무형태를 선택해주세요.");
                return;
            }

            // jQueryUI getDate함수 API문서: https://api.jqueryui.com/datepicker/#method-getDate
            // javascript Date 클래스: https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Date
            const date = $("#datepicker").datepicker("getDate");
            const inputYear = date.getFullYear();
            const inputMonth = date.getMonth() + 1;
            const inputDay = date.getDate();

            //연, 월 계산 
            const joinDate = new Date(inputYear, inputMonth - 1, inputDay);

            $(".showDate").text(
                `${inputYear}-${inputMonth}-${inputDay}` // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Template_literals
            );

            const list = [
                { name: "육군", Month: 18 },
                { name: "공군", Month: 21 },
                { name: "해군", Month: 20 },
                { name: "해병대", Month: 18 },
                { name: "의경(해경)", Month: 21 },
                { name: "소방원", Month: 20 },
                { name: "사회복무요원", Month: 20 },
            ];

            const armyMonth = list[0].Month;
            armyMonth -= 12;
            if(inputMonth <= 12 - armyMonth){
                inputYear += 1;
                inputMonth += armyMonth;
            }
            else{
                inputYear += 2;
                inputMonth -= 12 - armyMonth;
            }
            
            // 말일 계산
            if (inputDay === 1) {
                inputMonth -= 1;
                switch (inputMonth) {
                    case 1: case 3: case 5: case 7: case 8: case 10: case 12:
                        inputDay = 31;
                        break;
                    case 4: case 6: case 9: case 11:
                        inputDay = 30;
                        break;
                    case 2:
                        inputDay = 28;
                        break;
                }
            }
            else {
                inputDay -= 1;
            }
            /*
                2월 29, 30, 31일 처리
                2월 29일 - 윤년/평년 처리
            */
            if (inputMonth === 2 && inputDay === 29) {
                if (inputYear % 4 === 0) {
                    if (inputYear % 100 === 0) {
                        if (inputYear % 400 !== 0) {
                            inputMonth = 3;
                            inputDay = 1;
                        }
                    }
                }
                else {
                    inputMonth = 3;
                    inputDay = 1;
                }
            }

            if (inputMonth === 2 && inputDay === 30) {
                if (inputYear % 4 === 0) {
                    if (inputYear % 100 === 0) {
                        if (inputYear % 400 !== 0) {
                            inputDay = 2;
                        }
                    }
                    else {
                        inputDay = 1;
                    }
                }
                else {
                    inputDay = 2;
                }
                inputMonth = 3;
            }

            

            // 여기랑 각 군에 대한 버튼 클릭시 올바르게 계산되게 버튼 수정해야됨.
            const day = list.filter((item) => item.name === targetText)[0].day;

            date.setDate(day);

            $("#discharge").text(
                `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
            );
            $("#allDay").text(day);
            // calculator.js에서 선언, 전역일과 현재일을 파라미터로
            const dayLeft = dayBetweenDate(date, new Date());
            $("#dayLeft").text(dayLeft);
            $("#progress").attr("value", day - dayLeft);
            $("#progress").attr("max", day);
        },
    });
});

init();