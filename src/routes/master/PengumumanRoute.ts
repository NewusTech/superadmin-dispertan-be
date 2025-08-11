import { CONFIG } from '@/config'
import PengumumanController from '@/controllers/master/PengumumanController'
import { AuthMiddleware } from '@/middleware/AuthMiddleware'
import { fileUploadMiddleware } from '@/middleware/FileUploadMiddleware'
import { Router } from 'express'

const fileUpload = fileUploadMiddleware.fileUploadHandler('uploads', {
  maxFileSize: CONFIG.maxFileSize as number,
  allowedFileTypes : ['image/webp', 'image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'application/csv'],
  saveToBucket: CONFIG.saveToBucket,
})

export const PengumumanRouter = (): Router => {
  const router = Router()
  
    router.get('/', PengumumanController.getAllPengumuman)
    router.get('/detail/:id', PengumumanController.getDetailPengumuman)

  router.use(AuthMiddleware)
  
  router.post('/create', fileUpload.single('file'), PengumumanController.createPengumuman)
  router.put('/update/:id', fileUpload.single('file'), PengumumanController.updatePengumuman)
  router.delete('/delete/:id', PengumumanController.deletePengumuman)

  return router
}
