import SwiftUI
import WebKit
import Combine

struct WebMap: View {
    var items: [LocationEntry]

    var body: some View {
        WebviewView(items: items)
    }
}

struct WebviewView: UIViewControllerRepresentable {
    typealias UIViewControllerType = WebviewController
    
    var items: [LocationEntry]
    
    func makeUIViewController(context: Context) -> WebviewController {
        return WebviewController()
    }
    
    func updateUIViewController(_ uiViewController: WebviewController, context: Context) {
        uiViewController.update(items: items)
    }
}

class WebviewController: UIViewController {
    var lastAddedIndex = 0
    
    private lazy var webView: WKWebView = {
        let webView = WKWebView()
        webView.translatesAutoresizingMaskIntoConstraints = false
        return webView
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        webView.load(URLRequest(
            url: Bundle.main.url(forResource: "build", withExtension: "html")!
        ))

        view.addSubview(webView)
        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.bottomAnchor.constraint(equalTo: view.layoutMarginsGuide.bottomAnchor),
            webView.topAnchor.constraint(equalTo: view.layoutMarginsGuide.topAnchor)
        ])
    }
    
    func update(items: [LocationEntry]) {
        print("update", lastAddedIndex)
        if(webView.isLoading) {
            return
        }
        
        print("print after update ", lastAddedIndex)
        
        let newItems = Array(items[lastAddedIndex...])

        lastAddedIndex = items.count

        webView.evaluateJavaScript("""
            window.map.store.addPoints([
                \(newItems.map({"[\($0.latitude), \($0.longitude)]"}).joined(separator: ", "))
            ]);
        """,completionHandler: { (a,b) in print(a,b) })
        
        let lastNewItem = newItems.last;
        
        if(lastNewItem != nil) {
            webView.evaluateJavaScript("window.map.updatePosition([\(lastNewItem!.latitude), \(lastNewItem!.longitude)])");
        }
           
    }
}
