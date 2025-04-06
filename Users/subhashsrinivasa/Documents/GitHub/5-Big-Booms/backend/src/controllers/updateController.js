import { getTopNewsIssues } from new URL('../../../frontend/public/API.js', import.meta.url);

export const updateNews = async (req, res) => {
  try {
    const result = await getTopNewsIssues();
    res.json({
      success: true,
      message: 'News updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Update error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update news',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};