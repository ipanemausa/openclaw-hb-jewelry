import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturó:', error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: '#f0ede8',
          padding: '24px',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#d4af6a' }}>
            HB Jewelry — Error de carga
          </div>
          <div style={{ fontSize: '14px', color: '#a09d99', marginBottom: '24px', textAlign: 'center' }}>
            {this.state.error?.message || 'Error de renderizado interceptado'}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#d4af6a', color: '#000', border: 'none',
              borderRadius: '8px', padding: '10px 24px',
              fontSize: '14px', fontWeight: '600', cursor: 'pointer'
            }}
          >
            Recargar aplicación
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
