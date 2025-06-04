// Import required Node.js packages for the server
const express = require('express');          // Web framework for creating the API server
const mongoose = require('mongoose');        // MongoDB database connection and modeling
const cors = require('cors');               // Cross-Origin Resource Sharing middleware
const path = require('path');               // Node.js path utilities for file handling

// Create Express application instance
const app = express();
const PORT = process.env.PORT || 8000;      // Server port - use environment variable or default to 8000

// Middleware Configuration - Functions that run before route handlers
app.use(cors());                            // Allow cross-origin requests from frontend
app.use(express.json());                    // Parse JSON request bodies automatically
app.use(express.static('public'));          // Serve static files from 'public' directory

// MongoDB Database Connection
mongoose.connect('mongodb+srv://bdamouche1:Random52%3F@cluster0.ahajwej.mongodb.net/fennec_fc?retryWrites=true&w=majority&appName=Cluster0');

// Database connection event handlers
const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);                          // Exit application if database connection fails
});
db.once('open', () => {
  console.log('Connected to MongoDB successfully');
});

// Database Schema Definitions - Structure for storing data

// Player Schema - Defines how player data is stored in MongoDB
const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },                    // Player's full name (mandatory)
  position: { type: String, required: true },                // Playing position (mandatory)
  age: { type: Number, required: true },                     // Player's age (mandatory)
  nationality: { type: String, required: true },             // Player's nationality (mandatory)
  jerseyNumber: { type: Number, unique: true, required: true }, // Unique jersey number (mandatory)
  isAvailable: { type: Boolean, default: true },             // Availability status (defaults to available)
  createdAt: { type: Date, default: Date.now }               // Timestamp when player was added
});

// Team Schema - Defines how team data is stored in MongoDB
const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },                    // Team name (mandatory)
  formation: { type: String, required: true },               // Team formation like 4-4-2 (mandatory)
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }], // Array of player references
  createdAt: { type: Date, default: Date.now }               // Timestamp when team was created
});

// Tournament Schema - Defines how tournament data is stored in MongoDB
const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },                    // Tournament name (mandatory)
  startDate: { type: Date, required: true },                 // Tournament start date (mandatory)
  endDate: { type: Date, required: true },                   // Tournament end date (mandatory)
  location: { type: String, required: true },                // Tournament location (mandatory)
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }], // Array of team references
  maxTeams: { type: Number, default: 16 },                   // Maximum number of teams allowed
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' }, // Tournament status
  createdAt: { type: Date, default: Date.now }               // Timestamp when tournament was created
});

// Create MongoDB models from schemas - These are used to interact with database collections
const Player = mongoose.model('Player', playerSchema);
const Team = mongoose.model('Team', teamSchema);
const Tournament = mongoose.model('Tournament', tournamentSchema);

// ===== PLAYER API ROUTES =====

// GET all players - Retrieve and display all players sorted by jersey number
app.get('/api/players', async (req, res) => {
  try {
    const players = await Player.find().sort({ jerseyNumber: 1 }); // Sort by jersey number ascending
    res.json(players);                                              // Send players as JSON response
  } catch (error) {
    res.status(500).json({ error: error.message });                // Send error if database operation fails
  }
});

// GET single player by ID - Retrieve one specific player's information
app.get('/api/players/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);           // Find player by their unique ID
    if (!player) {
      return res.status(404).json({ error: 'Player not found' }); // Return 404 if player doesn't exist
    }
    res.json(player);                                              // Send player data as JSON
  } catch (error) {
    res.status(500).json({ error: error.message });               // Handle database errors
  }
});

// POST create new player - Add a new player to the database
app.post('/api/players', async (req, res) => {
  try {
    const { name, position, age, nationality, jerseyNumber } = req.body; // Extract data from request
    
    // Check if jersey number is already taken by another player
    const existingPlayer = await Player.findOne({ jerseyNumber });
    if (existingPlayer) {
      return res.status(400).json({ error: 'Jersey number already taken' }); // Prevent duplicate jersey numbers
    }

    // Create and save new player to database
    const player = new Player({ name, position, age, nationality, jerseyNumber });
    await player.save();
    res.status(201).json(player);                                  // Send created player back with 201 status
  } catch (error) {
    res.status(400).json({ error: error.message });               // Handle validation errors
  }
});

// PUT update existing player - Modify player information
app.put('/api/players/:id', async (req, res) => {
  try {
    const { name, position, age, nationality, jerseyNumber, isAvailable } = req.body;
    
    // Check if new jersey number conflicts with another player (excluding current player)
    if (jerseyNumber) {
      const existingPlayer = await Player.findOne({ 
        jerseyNumber, 
        _id: { $ne: req.params.id }                                // Exclude current player from search
      });
      if (existingPlayer) {
        return res.status(400).json({ error: 'Jersey number already taken' });
      }
    }

    // Update player with new information
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      { name, position, age, nationality, jerseyNumber, isAvailable },
      { new: true, runValidators: true }                           // Return updated document and validate
    );

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(player);                                              // Send updated player data
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE player - Remove player from database
app.delete('/api/players/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);  // Find and delete player
    if (!player) {
      return res.status(404).json({ error: 'Player not found' }); // Return 404 if player doesn't exist
    }
    res.json({ message: 'Player deleted successfully' });         // Confirm successful deletion
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== TEAM API ROUTES =====

// GET all teams - Retrieve all teams with their associated player information
app.get('/api/teams', async (req, res) => {
  try {
    const teams = await Team.find().populate('players');          // Load teams and populate player details
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single team by ID - Retrieve one specific team with player details
app.get('/api/teams/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('players'); // Find team and load player info
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new team - Add a new team to the database
app.post('/api/teams', async (req, res) => {
  try {
    const { name, formation, players } = req.body;
    
    // Validate that all provided player IDs actually exist in the database
    if (players && players.length > 0) {
      const validPlayers = await Player.find({ _id: { $in: players } });
      if (validPlayers.length !== players.length) {
        return res.status(400).json({ error: 'One or more player IDs are invalid' });
      }
    }

    // Create new team and populate player information for response
    const team = new Team({ name, formation, players: players || [] });
    await team.save();
    await team.populate('players');                                // Load full player details
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update existing team - Modify team information and player roster
app.put('/api/teams/:id', async (req, res) => {
  try {
    const { name, formation, players } = req.body;
    
    // Validate all player IDs exist before updating
    if (players && players.length > 0) {
      const validPlayers = await Player.find({ _id: { $in: players } });
      if (validPlayers.length !== players.length) {
        return res.status(400).json({ error: 'One or more player IDs are invalid' });
      }
    }

    // Update team with new information and return populated result
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { name, formation, players: players || [] },
      { new: true, runValidators: true }
    ).populate('players');

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE team - Remove team from database
app.delete('/api/teams/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== TOURNAMENT API ROUTES =====

// GET all tournaments - Retrieve all tournaments with teams and their players
app.get('/api/tournaments', async (req, res) => {
  try {
    // Load tournaments and populate teams, then populate players within each team
    const tournaments = await Tournament.find().populate({
      path: 'teams',
      populate: { path: 'players' }                               // Nested population: teams -> players
    });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single tournament by ID - Retrieve one specific tournament with full details
app.get('/api/tournaments/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id).populate({
      path: 'teams',
      populate: { path: 'players' }                               // Load teams and their players
    });
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new tournament - Add a new tournament to the database
app.post('/api/tournaments', async (req, res) => {
  try {
    const { name, startDate, endDate, location, teams, maxTeams } = req.body;
    
    // Validate that all provided team IDs actually exist in the database
    if (teams && teams.length > 0) {
      const validTeams = await Team.find({ _id: { $in: teams } });
      if (validTeams.length !== teams.length) {
        return res.status(400).json({ error: 'One or more team IDs are invalid' });
      }
    }

    // Create new tournament and populate full team/player information
    const tournament = new Tournament({ 
      name, 
      startDate, 
      endDate, 
      location, 
      teams: teams || [], 
      maxTeams 
    });
    await tournament.save();
    await tournament.populate({
      path: 'teams',
      populate: { path: 'players' }
    });
    res.status(201).json(tournament);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update existing tournament - Modify tournament information and team roster
app.put('/api/tournaments/:id', async (req, res) => {
  try {
    const { name, startDate, endDate, location, teams, maxTeams, status } = req.body;
    
    // Validate all team IDs exist before updating
    if (teams && teams.length > 0) {
      const validTeams = await Team.find({ _id: { $in: teams } });
      if (validTeams.length !== teams.length) {
        return res.status(400).json({ error: 'One or more team IDs are invalid' });
      }
    }

    // Update tournament with new information and return populated result
    const tournament = await Tournament.findByIdAndUpdate(
      req.params.id,
      { name, startDate, endDate, location, teams: teams || [], maxTeams, status },
      { new: true, runValidators: true }
    ).populate({
      path: 'teams',
      populate: { path: 'players' }
    });

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    res.json(tournament);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE tournament - Remove tournament from database
app.delete('/api/tournaments/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findByIdAndDelete(req.params.id);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    res.json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Frontend Route Handler - Serve the main HTML file for any non-API requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));    // Send main page for client-side routing
});

// Global Error Handling Middleware - Catches any unhandled errors
app.use((err, req, res, next) => {
  console.error(err.stack);                                      // Log error details for debugging
  res.status(500).json({ error: 'Something went wrong!' });     // Send generic error response
});

// Start the Server - Begin listening for incoming requests
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Fennec FC Management System is ready!');
});