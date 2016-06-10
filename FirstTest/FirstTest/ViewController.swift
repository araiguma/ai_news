//
//  ViewController.swift
//  FirstTest
//
//  Created by 新井　祐輝 on 2016/06/09.
//  Copyright © 2016年 新井　祐輝. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // 【1】 画像データをインスタンス化
        let imageA: UIImage! = UIImage(named: "Image1-A")
        let imageB: UIImage! = UIImage(named: "Image1-B")
        // 【2】 コマ送りに使う画像データの配列をセット
        イメージ.animationImages = [imageA, imageB]
        // 【3】 コマ送りの間隔を設定
        イメージ.animationDuration = 1
        // 【4】 コマ送りのアニメーションを開始
        イメージ.startAnimating()
    }

    @IBOutlet weak var イメージ: UIImageView!
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
   
    @IBAction func クリック戻る(sender: AnyObject) {
    }
    
    @IBAction func クリック進む(sender: AnyObject) {
    }
}

