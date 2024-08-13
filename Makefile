compile :; \
        cd app/circuits && \
        cd check_age && $$HOME/.nargo/bin/nargo compile && cd .. && \
        cd check_country && $$HOME/.nargo/bin/nargo compile && cd .. && \
        cd check_salary && $$HOME/.nargo/bin/nargo compile && cd .. 

install :; \
        cd app && \
        npm install

start :; \
        cd app && \
        npm run dev

deploy :; \
        cd app && \
        npm run build && \
        surge dist graceful-believe.surge.sh
