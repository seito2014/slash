#概要
LIG BLOGのコーディングにおけるスタイルガイドです。

本案件はSMACSS,OOCSS,BEMに従いつつ、独自のルールに基づいて設計されています。

#必須ツール,環境
・gulp 3.8.1~
・sass 3.4~(3.3でも動くかも？)

#レイヤー
サイトを構成する全ての要素を、__BLBEMS__という6つの階層に分けて考えます。

##1.Base
サイトの土台となる階層です。

###Baseに含まれるデータ

##2.Layout

##3.Block

##4.Element

##5.Modifier

##6.Status


#命名ルール
・単語の区切りは"_(アンダースコア)"を使用する
・BlockとElementの区切りは"--",Modifierは".-"で記述する
　例）.Block--Element.-modifier
・単語の諸略は禁止。ただし、WEB界隈に限らず世間的に広く認知されている略し方は可
例）navigation
	→ nav × 
	→ navi ○
	
	level
	→ lv ○


#CMSの組み込みを行う方へ