import React from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error; errorInfo: React.ErrorInfo }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({
            error,
            errorInfo
        });

        console.error('Error Boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                const FallbackComponent = this.props.fallback;
                return <FallbackComponent error={this.state.error!} errorInfo={this.state.errorInfo!} />;
            }

            return (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <h2 className="text-lg font-semibold text-red-800 mb-2">Algo salió mal</h2>
                    <details className="text-sm text-red-700">
                        <summary className="cursor-pointer mb-2">Detalles del error</summary>
                        <pre className="whitespace-pre-wrap mt-2 p-2 bg-red-100 rounded">
                            {this.state.error && this.state.error.toString()}
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </details>
                    <button
                        onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Reintentar
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
