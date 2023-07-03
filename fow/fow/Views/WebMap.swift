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
    private lazy var manager = {
        let m = MapStateManager()
        m.delegate = self
        return m
    }()
    
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
        
        let dir = url.deletingLastPathComponent()
        
        webView.loadFileURL(url, allowingReadAccessTo: dir)

        view.addSubview(webView)
        NSLayoutConstraint.activate([
            webView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            webView.bottomAnchor.constraint(equalTo: view.layoutMarginsGuide.bottomAnchor),
            webView.topAnchor.constraint(equalTo: view.layoutMarginsGuide.topAnchor)
        ])
    }
    
    func update(items: [LocationEntry]) {
        if(webView.isLoading) {
            queue = items
        } else {
            manager.update(items)
        }
    }
}

extension WebviewController : WKNavigationDelegate {
    func webView(
        _ webView: WKWebView,
        didFinish navigation: WKNavigation!
    ) {
        manager.update(queue)
        queue = []
    }
}

extension WebviewController : MapStateUpdate {
    func initState(initialData: [LocationEntry]) {
        webView.evaluateJavaScript("""
            receiver.init(
                [\(initialData.map({"[\($0.latitude), \($0.longitude)]"}).joined(separator: ", "))],
                "\(UserDefaults.standard.string(forKey: "map_type") ?? SettingsMapType.types[0].url)"
            );
        """)
    }
    
    func update(newItems: [LocationEntry]) {
        webView.evaluateJavaScript("""
            receiver.update([
                \(newItems.map({"[\($0.latitude), \($0.longitude)]"}).joined(separator: ", "))
            ]);
        """)
    }
    
    
}

class MapStateManager : NSObject {
    private var initialized = false
    private var lastAddedIndex = 0
    
    var delegate: MapStateUpdate? = nil
    
    func update(_ newItems: [LocationEntry]) {
        if(!initialized) {
            delegate?.initState(initialData: newItems)
            initialized = true
        } else {
            delegate?.update(newItems: Array(newItems[lastAddedIndex...]))
        }
        lastAddedIndex = newItems.count
    }
}

protocol MapStateUpdate {
    func initState(initialData: [LocationEntry]) -> Void
    func update(newItems: [LocationEntry]) -> Void
}
