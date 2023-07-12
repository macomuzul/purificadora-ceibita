const router = require('express').Router();

router.get('/calendarioIframe', async (req, res) => {
  res.sendFile('/calendarioIframe.html', {root: 'src/public/html'});
});

module.exports = router;