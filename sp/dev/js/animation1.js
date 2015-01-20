(function () {

    'use strict';

  

    // $(window).on('load',function(){
    //     //読み込み完了したらloadingを非表示
    //     $('#js_load').fadeOut(2000,
    //     function(){
    //         //切れ目アニメーション
    //         $('#slash_img_inner').addClass('is_animating');

    //         $('#slash_img_inner').on('webkitAnimationEnd',function(){
    //             setTimeout(function(){
    //                 $('#js_slash').addClass('is_animating');
    //             },1000);
    //         });
    //     });
    // });

    var $slash =$('#js_slash'),
        $slashInner = $slash.find('.slash_img_inner');

    $(window).on('load',function(){
        //切れ目アニメーション
        $slashInner.addClass('is_animating');

        // 上半分が斬れるアニメーション
        $slashInner.on('webkitAnimationEnd',function(){
            setTimeout(function(){
                $slash.addClass('is_animating');
            },1000);
        });
    });

})();

