import Game from '../models/Game.js';
import Family from '../models/Family.js';

// Create game
export const createGame = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      startTime, 
      endTime, 
      properties, 
      maxFamilies 
    } = req.body;

    const game = new Game({
      title,
      description,
      startTime,
      endTime,
      properties,
      maxFamilies
    });

    await game.save();

    res.status(201).json({
      message: 'Game created successfully',
      game
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all games
export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find()
      .populate('registeredFamilies', 'familyName believeValue')
      .sort({ startTime: -1 });

    res.json(games);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get game by ID
export const getGameById = async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = await Game.findById(gameId)
      .populate('registeredFamilies');

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Register family for game
export const registerFamily = async (req, res) => {
  try {
    const { gameId } = req.body;
    const userId = req.userId;

    // Get family
    const family = await Family.findOne({ userId });
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    // Get game
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Check max families
    if (game.registeredFamilies.length >= game.maxFamilies) {
      return res.status(400).json({ message: 'Game is full' });
    }

    // Check if already registered
    if (game.registeredFamilies.includes(family._id)) {
      return res.status(400).json({ message: 'Family already registered' });
    }

    // Register
    game.registeredFamilies.push(family._id);
    await game.save();

    family.gameId = gameId;
    family.status = 'registered';
    await family.save();

    res.json({
      message: 'Family registered successfully',
      game
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Start game
export const startGame = async (req, res) => {
  try {
    const { gameId } = req.body;

    const game = await Game.findByIdAndUpdate(
      gameId,
      { status: 'in_progress' },
      { new: true }
    ).populate('registeredFamilies');

    res.json({
      message: 'Game started',
      game
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// End game
export const endGame = async (req, res) => {
  try {
    const { gameId } = req.body;

    const game = await Game.findByIdAndUpdate(
      gameId,
      { status: 'completed' },
      { new: true }
    );

    res.json({
      message: 'Game ended',
      game
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get game statistics
export const getGameStats = async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = await Game.findById(gameId).populate('registeredFamilies');
    const families = await Family.find({ gameId });

    const stats = {
      totalFamilies: families.length,
      totalBelieveValue: families.reduce((sum, f) => sum + f.believeValue, 0),
      averageBelieveValue: families.length > 0 
        ? families.reduce((sum, f) => sum + f.believeValue, 0) / families.length 
        : 0,
      propertiesAcquired: families.reduce((sum, f) => sum + f.properties.length, 0),
      tasksCompleted: families.reduce((sum, f) => sum + f.completedTasks.length, 0)
    };

    res.json(stats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
