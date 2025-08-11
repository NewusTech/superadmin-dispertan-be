import FaqController from '@/controllers/master/FaqController'
import { AuthMiddleware } from '@/middleware/AuthMiddleware'
import { Router } from 'express'

export const FaqRouter = (): Router => {
  const router = Router()
  
  router.get('/', FaqController.getAllFaq)
  router.get('/detail/:id', FaqController.getDetailFaq)

  router.use(AuthMiddleware)

  router.post('/create', FaqController.createFaq)
  router.put('/update/:id', FaqController.updateFaq)
  router.delete('/delete/:id', FaqController.deleteFaq)

  return router
}
