import './App.css'
import DocumentPreview from './component/document_preview'
import { mockDocumentData } from './data/mock_data'

function App() {
  return <DocumentPreview data={mockDocumentData} />
}

export default App
