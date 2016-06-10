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
        // Do any additional setup after loading the view, typically from a nib.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBOutlet weak var myTextField: UITextField!

    @IBAction func TapHandler(sender: AnyObject) {
        myTextField.text = "変更"
    }
}

