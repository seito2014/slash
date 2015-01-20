(function () {

  'use strict';

    $(window).on('load',function(){
        //読み込み完了したらloadingを非表示
        $('#js_load').fadeOut(2000,
        function(){
            //切れ目アニメーション
            $('#slash_bg_inner').addClass('is_animating');

            $('#slash_bg_inner').on('webkitAnimationEnd',function(){
                setTimeout(function(){
                    $('#js_slash').addClass('is_animating');
                },1000);
            });
        });
    });

})();

