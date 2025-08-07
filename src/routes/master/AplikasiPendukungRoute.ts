import AplikasiPendukungController from '@/controllers/master/AplikasiPendukungController'
import { AuthMiddleware } from '@/middleware/AuthMiddleware'
import { Router } from 'express'

export const AplikasiPendukungRouter = (): Router => {
  const router = Router()

  router.use(AuthMiddleware)

  router.get('/', AplikasiPendukungController.getAllAplikasiPendukung)
  router.get('/detail/:id', AplikasiPendukungController.getDetailAplikasPendukung)
  router.put('/update/:id', AplikasiPendukungController.updateAplikasiPendukung)

  return router
}
