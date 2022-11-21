import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    componentDidCatch(error, info) {
      // Display fallback UI
      this.setState({ hasError: true });
      // You can also log the error to an error reporting service
      console.error(error, info);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        setTimeout(function() { location.reload()}, 5000);

        return (
          <div>
          <h4>App is unwilling to perform</h4>
          </div>
          );
      }
      return this.props.children;
    }
}

export default ErrorBoundary ;