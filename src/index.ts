import { SourceService } from './services/SourceService'

const sourceService = new SourceService()

const sourceDocuments = await sourceService.getSourceDocuments()

console.table(sourceDocuments.at(0))
