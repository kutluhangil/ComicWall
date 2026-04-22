import { Component, ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen flex items-center justify-center px-5 sm:px-8 bg-background">
          <div className="text-center max-w-2xl">
            <h1 className="font-bebas text-7xl md:text-9xl tracking-wide text-foreground mb-6">
              Hata
            </h1>
            <p className="text-xl md:text-2xl font-medium text-foreground mb-3">
              Beklenmedik bir hata oluştu
            </p>
            <p className="text-base text-muted-foreground mb-10 max-w-md mx-auto">
              Üzgünüz, bir şeyler ters gitti. Lütfen sayfayı yenileyin veya ana sayfaya dönün.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => window.location.reload()}
                className="inline-block px-8 py-3.5 bg-primary text-primary-foreground text-sm uppercase tracking-widest font-bold rounded-2xl hover:bg-primary/90 transition-colors"
              >
                Sayfayı Yenile
              </button>
              <Link
                to="/"
                className="inline-block px-8 py-3.5 border border-border text-foreground text-sm uppercase tracking-widest font-bold rounded-2xl hover:bg-muted transition-colors"
              >
                Ana Sayfa
              </Link>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
