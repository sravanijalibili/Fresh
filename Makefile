# ============================================================
# FRESH MOBILE APP - MAKEFILE
# ============================================================

SHELL := /bin/bash

# ============================================================
# DIRECTORIES
# ============================================================

FRONTEND_DIR := frontend
BACKEND_DIR := backend

# ============================================================
# PYTHON
# ============================================================

PYTHON := python
MANAGE := $(PYTHON) $(BACKEND_DIR)/manage.py


# ============================================================
# DEFAULT COMMAND
# ============================================================

.DEFAULT_GOAL := help


# ============================================================
# HELP
# ============================================================

help:
	@echo ""
	@echo "Fresh Mobile App - Available Commands"
	@echo "======================================"
	@echo ""
	@echo "Development:"
	@echo "  make frontend          Start React frontend"
	@echo "  make backend           Start Django backend"
	@echo "  make dev               Show development commands"
	@echo ""
	@echo "Dependencies:"
	@echo "  make install           Install frontend + backend dependencies"
	@echo "  make install-frontend  Install frontend dependencies"
	@echo "  make install-backend   Install backend dependencies"
	@echo ""
	@echo "Database:"
	@echo "  make migrate           Run Django migrations"
	@echo "  make makemigrations    Create Django migrations"
	@echo "  make seed              Seed database"
	@echo "  make superuser         Create Django superuser"
	@echo ""
	@echo "Quality:"
	@echo "  make spellcheck       Run spell checker"
	@echo "  make lint             Run frontend lint"
	@echo "  make format           Format frontend code"
	@echo ""
	@echo "Build:"
	@echo "  make build             Build frontend for production"
	@echo ""
	@echo "Utilities:"
	@echo "  make shell             Open Django shell"
	@echo "  make clean             Remove build/cache files"
	@echo "  make help              Show this help"
	@echo ""


# ============================================================
# INSTALL
# ============================================================

install: install-frontend install-backend

	@echo ""
	@echo "All dependencies installed successfully."


install-frontend:

	@echo "Installing frontend dependencies..."

	cd $(FRONTEND_DIR) && npm install


install-backend:

	@echo "Installing backend dependencies..."

	cd $(BACKEND_DIR) && pip install -r requirements.txt


# ============================================================
# DEVELOPMENT
# ============================================================

frontend:

	@echo "Starting Fresh frontend..."

	cd $(FRONTEND_DIR) && npm run dev


backend:

	@echo "Starting Fresh backend..."

	$(MANAGE) runserver


dev:

	@echo ""
	@echo "Start the two servers in separate terminals:"
	@echo ""
	@echo "Terminal 1:"
	@echo "  make frontend"
	@echo ""
	@echo "Terminal 2:"
	@echo "  make backend"
	@echo ""


# ============================================================
# DATABASE
# ============================================================

makemigrations:

	@echo "Creating Django migrations..."

	$(MANAGE) makemigrations


migrate:

	@echo "Running Django migrations..."

	$(MANAGE) migrate


seed:

	@echo "Seeding database..."

	$(MANAGE) seed


superuser:

	@echo "Creating Django superuser..."

	$(MANAGE) createsuperuser


shell:

	@echo "Opening Django shell..."

	$(MANAGE) shell


# ============================================================
# FRONTEND BUILD
# ============================================================

build:

	@echo "Building frontend..."

	cd $(FRONTEND_DIR) && npm run build


preview:

	@echo "Starting frontend production preview..."

	cd $(FRONTEND_DIR) && npm run preview


# ============================================================
# FRONTEND QUALITY
# ============================================================

lint:

	@echo "Running frontend lint..."

	cd $(FRONTEND_DIR) && npm run lint


format:

	@echo "Formatting frontend..."

	cd $(FRONTEND_DIR) && npm run format


spellcheck:

	@echo "Running spellcheck..."

	cd $(FRONTEND_DIR) && npm run spellcheck


# ============================================================
# TESTING
# ============================================================

test-backend:

	@echo "Running Django tests..."

	$(MANAGE) test


test-frontend:

	@echo "Running frontend tests..."

	cd $(FRONTEND_DIR) && npm test


test: test-backend test-frontend


# ============================================================
# CLEAN
# ============================================================

clean:

	@echo "Cleaning project..."

	rm -rf $(FRONTEND_DIR)/dist

	rm -rf $(FRONTEND_DIR)/node_modules/.vite

	find $(BACKEND_DIR) -type d -name "__pycache__" -exec rm -rf {} +

	find $(BACKEND_DIR) -type f -name "*.pyc" -delete

	@echo "Clean complete."