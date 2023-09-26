const router = require('express').Router()

router.get('/calendarioIframe', async (req, res) => res.sendFile('/calendarioIframe.html', { root: 'src/public/html' }))
router.get('/calendarioIframeMultiple', async (req, res) => res.sendFile('/calendarioIframeMultiple.html', { root: 'src/public/html' }))
router.get('/calendarioIframeEntre', async (req, res) => res.sendFile('/calendarioIframeEntre.html', { root: 'src/public/html' }))

module.exports = router