(function () {

    'use strict';



    var $slash =$('#js_slash'),
        $slashInner = $slash.find('.slash_img_inner');

    $(window).on('load',function(){
        //切れ目アニメーション
        setTimeout(function() {
            $slashInner.addClass('is_animating');
        },1000);

        // 上半分が斬れるアニメーション
        $slashInner.on('webkitAnimationEnd',function(){
            setTimeout(function(){
                $slash.addClass('is_animating');
            },1000);
        });

        //.slashを丸ごと消す
        $slash.find('.up').on('webkitAnimationEnd',function(){
            $slash.find('.slash_inner').addClass('is_hidden');
        });
    });

})();

