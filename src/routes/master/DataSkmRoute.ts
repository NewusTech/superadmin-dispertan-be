import DataSkmController from '@/controllers/master/DataSkmController'
import { AuthMiddleware } from '@/middleware/AuthMiddleware'
import { Router } from 'express'

export const DataSkmRouter = (): Router => {
  const router = Router()

  router.post('/create', DataSkmController.createDataSkm)

  router.use(AuthMiddleware)

  router.get('/', DataSkmController.getAllDataSkm)
  router.get('/detail/:id', DataSkmController.getDetailDataSkm)

  return router
}
