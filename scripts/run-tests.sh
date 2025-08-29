#!/bin/bash

# Test Runner Utility for LCM Service
# Usage: ./scripts/run-tests.sh [test-type] [options]

set -e

TEST_TYPE=${1:-"all"}
VERBOSE=${2:-""}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 LCM Service Test Runner${NC}"
echo "============================="

# Set verbose flag if requested
JEST_ARGS=""
if [[ "$VERBOSE" == "--verbose" || "$VERBOSE" == "-v" ]]; then
    JEST_ARGS="--verbose"
fi

case $TEST_TYPE in
  "all"|"complete")
    echo -e "${BLUE}🔍 Running complete test suite...${NC}"
    echo ""
    
    echo -e "${YELLOW}1️⃣  Unit Tests${NC}"
    npm run test $JEST_ARGS
    
    echo -e "${YELLOW}2️⃣  Integration Tests${NC}"
    npm run test:e2e $JEST_ARGS
    
    echo -e "${YELLOW}3️⃣  Test Coverage${NC}"
    npm run test:cov
    
    echo -e "${GREEN}✅ Complete test suite finished${NC}"
    ;;
    
  "unit")
    echo -e "${BLUE}🔬 Running unit tests...${NC}"
    npm run test $JEST_ARGS
    echo -e "${GREEN}✅ Unit tests completed${NC}"
    ;;
    
  "integration"|"e2e")
    echo -e "${BLUE}🔗 Running integration tests...${NC}"
    npm run test:e2e $JEST_ARGS
    echo -e "${GREEN}✅ Integration tests completed${NC}"
    ;;
    
  "coverage"|"cov")
    echo -e "${BLUE}📊 Running test coverage analysis...${NC}"
    npm run test:cov
    echo -e "${GREEN}✅ Coverage analysis completed${NC}"
    ;;
    
  "watch")
    echo -e "${BLUE}👀 Running tests in watch mode...${NC}"
    npm run test:watch
    ;;
    
  "debug")
    echo -e "${BLUE}🐛 Running tests in debug mode...${NC}"
    npm run test:debug
    ;;
    
  "module")
    if [ -z "$2" ]; then
        echo -e "${RED}❌ Module name required${NC}"
        echo "Usage: $0 module <module-name>"
        echo "Example: $0 module customer"
        exit 1
    fi
    
    MODULE_NAME=$2
    echo -e "${BLUE}📦 Running tests for module: $MODULE_NAME${NC}"
    npm run test -- --testPathPattern="$MODULE_NAME" $JEST_ARGS
    echo -e "${GREEN}✅ Module tests completed${NC}"
    ;;
    
  "performance"|"perf")
    echo -e "${BLUE}⚡ Running performance tests...${NC}"
    echo "🔍 Performance test categories:"
    echo "- Database query performance"
    echo "- Bulk operations"
    echo "- Memory usage"
    echo "- API response times"
    
    npm run test -- --testNamePattern="Performance" $JEST_ARGS
    echo -e "${GREEN}✅ Performance tests completed${NC}"
    ;;
    
  "debt-collection"|"business")
    echo -e "${BLUE}💼 Running debt collection business logic tests...${NC}"
    echo "🔍 Business test scenarios:"
    echo "- Customer debt management"
    echo "- Payment processing"
    echo "- Call system integration"
    echo "- Partner workflows"
    
    npm run test -- --testNamePattern="DebtCollection|Business" $JEST_ARGS
    echo -e "${GREEN}✅ Business logic tests completed${NC}"
    ;;
    
  "mock-data"|"generators")
    echo -e "${BLUE}🎲 Running mock data generator tests...${NC}"
    npm run test -- --testPathPattern="test-utils" --testNamePattern="MockDataGenerator" $JEST_ARGS
    echo -e "${GREEN}✅ Mock data generator tests completed${NC}"
    ;;
    
  "database"|"db")
    echo -e "${BLUE}🗄️  Running database tests...${NC}"
    echo "🔍 Database test scenarios:"
    echo "- Connection tests"
    echo "- CRUD operations"
    echo "- Query performance"
    echo "- Data integrity"
    
    npm run test -- --testNamePattern="Database|Repository" $JEST_ARGS
    echo -e "${GREEN}✅ Database tests completed${NC}"
    ;;
    
  "security")
    echo -e "${BLUE}🔒 Running security tests...${NC}"
    echo "🔍 Security test scenarios:"
    echo "- Authentication tests"
    echo "- Authorization tests"
    echo "- Data encryption tests"
    echo "- Input validation tests"
    
    npm run test -- --testNamePattern="Security|Auth|Validation" $JEST_ARGS
    echo -e "${GREEN}✅ Security tests completed${NC}"
    ;;
    
  "api"|"endpoints")
    echo -e "${BLUE}🌐 Running API endpoint tests...${NC}"
    npm run test:e2e -- --testNamePattern="Controller|API" $JEST_ARGS
    echo -e "${GREEN}✅ API endpoint tests completed${NC}"
    ;;
    
  "quick"|"fast")
    echo -e "${BLUE}⚡ Running quick test suite...${NC}"
    echo "🔍 Quick tests (no coverage, no e2e):"
    npm run test -- --passWithNoTests --maxWorkers=4 $JEST_ARGS
    echo -e "${GREEN}✅ Quick tests completed${NC}"
    ;;
    
  "clean")
    echo -e "${BLUE}🧹 Cleaning test artifacts...${NC}"
    rm -rf coverage/
    rm -rf .nyc_output/
    rm -rf test-results/
    echo -e "${GREEN}✅ Test artifacts cleaned${NC}"
    ;;
    
  "help")
    echo -e "${YELLOW}Available test commands:${NC}"
    echo ""
    echo -e "${PURPLE}General:${NC}"
    echo "  all              - Run complete test suite (unit + integration + coverage)"
    echo "  unit             - Run unit tests only"
    echo "  integration|e2e  - Run integration/e2e tests only"
    echo "  coverage|cov     - Run test coverage analysis"
    echo "  watch            - Run tests in watch mode"
    echo "  debug            - Run tests in debug mode"
    echo "  quick|fast       - Run quick test suite (no coverage)"
    echo ""
    echo -e "${PURPLE}Module-specific:${NC}"
    echo "  module <name>    - Run tests for specific module"
    echo "  performance|perf - Run performance tests"
    echo "  business         - Run debt collection business logic tests"
    echo "  database|db      - Run database tests"
    echo "  security         - Run security tests"
    echo "  api|endpoints    - Run API endpoint tests"
    echo ""
    echo -e "${PURPLE}Utilities:${NC}"
    echo "  mock-data        - Test mock data generators"
    echo "  clean            - Clean test artifacts"
    echo "  help             - Show this help message"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo "  --verbose, -v    - Verbose output"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo "  ./scripts/run-tests.sh all --verbose"
    echo "  ./scripts/run-tests.sh module customer"
    echo "  ./scripts/run-tests.sh performance"
    echo "  ./scripts/run-tests.sh business --verbose"
    ;;
    
  *)
    echo -e "${RED}❌ Unknown test type: $TEST_TYPE${NC}"
    echo "Run './scripts/run-tests.sh help' for available commands"
    exit 1
    ;;
esac

echo ""
echo -e "${BLUE}Test run completed at $(date)${NC}"
echo -e "${YELLOW}💡 Tip: Use './scripts/run-tests.sh help' to see all available options${NC}"