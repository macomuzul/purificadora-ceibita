const router = require('express').Router();

router.get('/calendarioIframe', async (req, res) => {
  console.log("jejeje")
  res.sendFile('/calendarioIframe.html', {root: 'src/public/html'});
});

module.exports = router;