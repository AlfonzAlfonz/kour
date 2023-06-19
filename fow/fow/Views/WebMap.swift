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
    
    var queue: [LocationEntry] = []
    
    private lazy var webView: WKWebView = {
        let webView = WKWebView()
        webView.navigationDelegate = self
        webView.translatesAutoresizingMaskIntoConstraints = false
        return webView
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let url = Bundle.main.url(forResource: "build", withExtension: "html", subdirectory: "dist")!
        
        webView.loadFileURL(url, allowingReadAccessTo: url)

        view.addSubview(webView)
        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.bottomAnchor.constraint(equalTo: view.layoutMarginsGuide.bottomAnchor),
            webView.topAnchor.constraint(equalTo: view.layoutMarginsGuide.topAnchor)
        ])
    }
    
    func update(items: [LocationEntry]) {
        let newItems = Array(items[lastAddedIndex...])

        lastAddedIndex = items.count
        
        if(webView.isLoading) {
            queue = queue + newItems
        } else {
            sendPoints(newItems, updatePosition: false)
        }
    }
    
    func sendPoints(_ newItems: [LocationEntry], updatePosition: Bool) {
        webView.evaluateJavaScript("""
            window.map.updateMapType("\(UserDefaults.standard.string(forKey: "map_type") ?? SettingsMapType.types[0].url)");
            window.map.store.addPoints([
                \(newItems.map({"[\($0.latitude), \($0.longitude)]"}).joined(separator: ", "))
            ]);
        """)
        
        let lastNewItem = newItems.last;
        
        if(lastNewItem != nil) {
            webView.evaluateJavaScript("window.map.updatePosition([\(lastNewItem!.latitude), \(lastNewItem!.longitude)])");
        }
    }
}

extension WebviewController : WKNavigationDelegate {
    func webView(
        _ webView: WKWebView,
        didFinish navigation: WKNavigation!
    ) {
        sendPoints(queue, updatePosition: true)
    }
}
