import json
import os
import psycopg2
import bcrypt
import secrets
from datetime import datetime, timedelta

def handler(event: dict, context) -> dict:
    '''API авторизации и управления пользователями'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        path = event.get('queryStringParameters', {}).get('action', '')
        
        if method == 'POST' and path == 'register':
            body = json.loads(event.get('body', '{}'))
            username = body.get('username', '').strip()
            password = body.get('password', '').strip()
            email = body.get('email', '').strip()
            
            if not username or not password:
                return make_response(400, {'error': 'Username and password required'})
            
            cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
            if cursor.fetchone():
                return make_response(400, {'error': 'Username already exists'})
            
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            cursor.execute(
                "INSERT INTO users (username, password_hash, email) VALUES (%s, %s, %s) RETURNING id, username, role, is_admin",
                (username, password_hash, email if email else None)
            )
            user = cursor.fetchone()
            conn.commit()
            
            session_token = secrets.token_urlsafe(32)
            
            cursor.close()
            conn.close()
            
            return make_response(200, {
                'success': True,
                'user': {
                    'id': user[0],
                    'username': user[1],
                    'role': user[2],
                    'is_admin': user[3]
                },
                'token': session_token
            })
        
        elif method == 'POST' and path == 'login':
            body = json.loads(event.get('body', '{}'))
            username = body.get('username', '').strip()
            password = body.get('password', '').strip()
            
            if not username or not password:
                return make_response(400, {'error': 'Username and password required'})
            
            cursor.execute(
                "SELECT id, username, password_hash, role, is_admin, is_banned FROM users WHERE username = %s",
                (username,)
            )
            user = cursor.fetchone()
            
            if not user:
                return make_response(401, {'error': 'Invalid credentials'})
            
            if user[5]:
                return make_response(403, {'error': 'User is banned'})
            
            if not bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8')):
                return make_response(401, {'error': 'Invalid credentials'})
            
            session_token = secrets.token_urlsafe(32)
            
            cursor.close()
            conn.close()
            
            return make_response(200, {
                'success': True,
                'user': {
                    'id': user[0],
                    'username': user[1],
                    'role': user[3],
                    'is_admin': user[4]
                },
                'token': session_token
            })
        
        elif method == 'GET' and path == 'users':
            cursor.execute(
                "SELECT id, username, email, role, status, is_admin, is_banned, is_muted, avatar_url, created_at FROM users ORDER BY created_at DESC"
            )
            users = cursor.fetchall()
            
            cursor.close()
            conn.close()
            
            return make_response(200, {
                'users': [{
                    'id': u[0],
                    'username': u[1],
                    'email': u[2],
                    'role': u[3],
                    'status': u[4],
                    'is_admin': u[5],
                    'is_banned': u[6],
                    'is_muted': u[7],
                    'avatar_url': u[8],
                    'created_at': str(u[9])
                } for u in users]
            })
        
        elif method == 'PUT' and path == 'user':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            updates = body.get('updates', {})
            
            if not user_id:
                return make_response(400, {'error': 'User ID required'})
            
            set_clauses = []
            values = []
            
            for key in ['is_banned', 'is_muted', 'is_admin', 'role', 'status', 'avatar_url']:
                if key in updates:
                    set_clauses.append(f"{key} = %s")
                    values.append(updates[key])
            
            if not set_clauses:
                return make_response(400, {'error': 'No updates provided'})
            
            values.append(user_id)
            query = f"UPDATE users SET {', '.join(set_clauses)} WHERE id = %s"
            
            cursor.execute(query, values)
            conn.commit()
            
            cursor.close()
            conn.close()
            
            return make_response(200, {'success': True})
        
        cursor.close()
        conn.close()
        return make_response(404, {'error': 'Not found'})
        
    except Exception as e:
        return make_response(500, {'error': str(e)})

def make_response(status_code: int, data: dict) -> dict:
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data, ensure_ascii=False),
        'isBase64Encoded': False
    }
