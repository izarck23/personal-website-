import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Home, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      localStorage.removeItem('codertech_profile');
      window.location.hash = '#home';
      window.location.reload();
    } catch (e) {
      window.location.reload();
    }
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = '#home';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF8F3] text-stone-800 flex items-center justify-center p-4 sm:p-8 font-sans">
          <div className="max-w-lg w-full bg-white rounded-[32px] border border-stone-200 shadow-xl p-8 sm:p-10 text-center">
            {/* Warning Icon */}
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-6 shadow-2xs">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              We encountered an unexpected issue while rendering this page. You can safely reload or return to the portfolio homepage.
            </p>

            {/* Error Message Box (if available) */}
            {this.state.error && (
              <div className="text-left bg-stone-50 rounded-2xl p-4 border border-stone-200 mb-6 overflow-hidden">
                <p className="text-xs font-mono text-rose-600 break-words line-clamp-3">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {/* Recovery Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#6C5CE7] hover:bg-[#5b4bc4] text-white rounded-full font-bold text-xs shadow-soft transition-all cursor-pointer"
                id="btn-error-reload"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full font-bold text-xs transition-all cursor-pointer"
                id="btn-error-home"
              >
                <Home className="w-4 h-4" />
                <span>Home Page</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 text-stone-500 hover:text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
                title="Reset local settings"
                id="btn-error-reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Cache</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
