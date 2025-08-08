import PertanyaanSkmController from '@/controllers/master/PertanyaanSkmController'
import { AuthMiddleware } from '@/middleware/AuthMiddleware'
import { Router } from 'express'

export const PertanyaanSkmRouter = (): Router => {
  const router = Router()

  router.use(AuthMiddleware)

  router.get('/', PertanyaanSkmController.getAllPertanyaanSkm)
  router.get('/detail/:id', PertanyaanSkmController.getDetailPertanyaanSkm)
  router.post('/create', PertanyaanSkmController.createPertanyaanSkm)
  router.put('/update/:id', PertanyaanSkmController.updatePertanyaanSkm)
  router.delete('/delete/:id', PertanyaanSkmController.deletePertanyaanSkm)

  return router
}
