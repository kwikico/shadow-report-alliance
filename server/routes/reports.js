const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// GET all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new report
router.post('/', async (req, res) => {
  const report = new Report({
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    category: req.body.category,
    evidence: req.body.evidence || [],
    updates: req.body.updates,
  });

  try {

    const newReport = await report.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET a specific report
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST support for a report
router.post('/:id/support', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.supporters += 1;
    await report.save();

    res.json({ message: 'Support added', supporters: report.supporters });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;