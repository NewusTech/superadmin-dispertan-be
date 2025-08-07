import { CONFIG } from '@/config'
import { fileUploadMiddleware } from '@/middleware/FileUploadMiddleware'
import {
  type Express,
  type Request,
  type Response,
} from 'express'
import { AuthRoute } from './auth/AuthRoute'
import { UserRouter } from './master/UserRoute'
import TestController from '@/controllers/master/TestController'
import { ResponseData } from '@/utilities/Response'
import { AplikasiPendukungRouter } from '@/routes/master/AplikasiPendukungRoute'
import { PengumumanRouter } from '@/routes/master/PengumumanRoute'

const fileUpload = fileUploadMiddleware.fileUploadHandler('uploads', {
  maxFileSize: CONFIG.maxFileSize as number,
  allowedFileTypes : ['image/webp', 'image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'application/csv'],
  saveToBucket: CONFIG.saveToBucket,
})

export const appRouter = async function (app: Express): Promise<void> {
  app.get('/', (req: Request, res: Response) => {
    const data = {
      message: `Welcome to ${CONFIG.appName} for more function use ${CONFIG.apiUrl} as main router`,
    }
    return ResponseData.ok(res, data, 'Welcome to API')
  })

  // other route
  // auth route
  app.use(CONFIG.apiUrl + 'auth', AuthRoute())

  // master route
  app.use(CONFIG.apiUrl + 'master/user', UserRouter())
  app.use(CONFIG.apiUrl + 'master/aplikasi-pendukung', AplikasiPendukungRouter())
  app.use(CONFIG.apiUrl + 'master/pengumuman', PengumumanRouter())

  app.post(CONFIG.apiUrl + 'test-up-file', fileUpload.single('images'), TestController.testFileUploadToS3)
  app.post(CONFIG.apiUrl + 'test-up-delete', fileUpload.single('images'), TestController.deleteFileFromS3)
}
