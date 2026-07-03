import os
from sqlmodel import create_engine, Session, text

# Render PostgreSQL Engine (Target)
postgres_url = "postgresql://resume_db_xev4_user:OleJVEojFU9LN0dMf8QsjKdqFFMBsAVm@dpg-d937284vikkc73e6b3o0-a.oregon-postgres.render.com/resume_db_xev4"
engine = create_engine(postgres_url)

def fix_sequences():
    print("Synchronizing PostgreSQL sequence generators...")
    # List of tables to fix
    tables = ["user", "usersetting", "savedjob", "resumescan", "passwordresettoken"]
    
    with Session(engine) as session:
        for t in tables:
            try:
                # Find maximum ID currently in the table
                max_id_query = f'SELECT MAX(id) FROM "{t}"'
                max_id = session.execute(text(max_id_query)).scalar()
                
                if max_id and max_id > 0:
                    # In PostgreSQL, auto-increment sequences created via serial are named {table}_id_seq
                    # Since "user" is a reserved word, its sequence is typically named user_id_seq
                    seq_name = f"{t}_id_seq"
                    
                    # Update sequence current value to max_id
                    sync_query = f"SELECT setval('{seq_name}', {max_id})"
                    session.execute(text(sync_query))
                    print(f"Synchronized table '{t}' sequence to {max_id}")
                else:
                    print(f"Table '{t}' has no rows, sequence reset skipped.")
            except Exception as e:
                # Check for possible different sequence names or if table has no serial sequence
                print(f"Could not reset sequence for '{t}' using standard name: {e}")
        
        session.commit()
    print("Database synchronization script execution completed.")

if __name__ == "__main__":
    fix_sequences()
