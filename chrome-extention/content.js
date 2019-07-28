var playingKey = null;

var Background = chrome.extension.connect({
    name: "content"
});

Background.onMessage.addListener(function (data) {
    console.log('onMessage', data);
});

(function () {
    $(document).ready(function () {
        console.log('content.js');
        noticeCounter = new NoticeCounter();
        noticeCounter.update();
    });
})();

function NoticeCounter() {
    var self = this;
    var noticeCountBox = $('\
            <div class="noticeCountBox container"> \
                <div class="row"> \
                    <input class="col-12 noticeTemplate text-center bg-warning" type="text" value="[100킬] 좌측팀 {L} : {R} 우측팀" title="표시될 내용 입력 {L} 과 {R} 은 Left 카운트와 Right 카운트"/> \
                </div> \
                <div class="row"> \
                    <div class="col-6 noticeValues"> \
                        <input class="col-12 leftCount text-center bg-success" type="text" value="0" value="{L} 팀 카운트 입력"/> \
                    </div> \
                    <div class="col-6 noticeValues"> \
                        <input class="col-12 rightCount text-center bg-primary" type="text" value="0" value="{R} 팀 카운트 입력"/> \
                    </div> \
                </div> \
                <div class="row"> \
                    <div class="col-3 buttonBox"> \
                        <button type="button" class="btn btn-block btn-success leftPlus">+</button> \
                    </div> \
                    <div class="col-3 buttonBox"> \
                        <button type="button" class="btn btn-block btn-success leftMinus">-</button> \
                    </div> \
                    <div class="col-3 buttonBox"> \
                        <button type="button" class="btn btn-block btn-primary rightPlus">+</button> \
                    </div> \
                    <div class="col-3 buttonBox"> \
                        <button type="button" class="btn btn-block btn-primary rightMinus">-</button> \
                    </div> \
                </div> \
                <div class="row" title="미리보기"> \
                    <div class="col-12 noticePreview text-center bg-white"/> \
                </div> \
                <div class="row mt3"> \
                    <div class="col-6"> \
                        <input id="autoSendCheckbox" type="checkbox" class="form-check-input"/> \
                        <label class="form-check-label" for="autoSendCheckbox">자동 보내기</label> \
                    </div> \
                    <div class="col-6 noticeValues"> \
                        <button id="send" type="button" class="btn btn-block btn-sm btn-danger">전송</button> \
                    </div> \
                </div> \
            </div>');

    $('#chatbox').css('top', '150px').after(noticeCountBox);

    $('.leftPlus').on('click', function () {
        var value = parseInt($('input.leftCount').val());
        value += 1;
        $('input.leftCount').val(value);

        self.update();
    });

    $('.leftMinus').on('click', function () {
        var value = parseInt($('input.leftCount').val());
        value -= 1;
        $('input.leftCount').val(value);

        self.update();
    });

    $('.rightPlus').on('click', function () {
        var value = parseInt($('input.rightCount').val());
        value += 1;
        $('input.rightCount').val(value);

        self.update();
    });

    $('.rightMinus').on('click', function () {
        var value = parseInt($('input.rightCount').val());
        value -= 1;
        $('input.rightCount').val(value);

        self.update();
    });

    $('input#autoSendCheckbox').on('change', function () {
        if ($(this).is(":checked")) {
            $('button#send').addClass('disabled').prop('disabled', true);
        } else {
            $('button#send').removeClass('disabled').prop('disabled', null);
        }
    });

    $('button#send').on('click', function () {
        self.update();
        self.sendNotice($('.noticePreview').text());
    });

    this.update = function () {
        var leftReg = /\{L}/gm;
        var rightReg = /\{R}/gm;

        var noticePreview = $('.noticePreview');
        var noticeTemplateText = $('.noticeTemplate').val();

        noticeTemplateText = noticeTemplateText.replace(leftReg, $('input.leftCount').val());
        noticeTemplateText = noticeTemplateText.replace(rightReg, $('input.rightCount').val());

        noticePreview.text(noticeTemplateText);

        if ($('input#autoSendCheckbox').is(":checked")) {
            this.sendNotice(noticeTemplateText);
        }
    };

    this.sendNotice = function (msg) {
        $('#write_area').text('!공지 ' + msg);
        $('.btn_send').click();
    };
}