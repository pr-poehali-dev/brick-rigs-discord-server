import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''API форума для постов, жалоб и анкет'''
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
        
        if method == 'GET' and path == 'posts':
            post_type = event.get('queryStringParameters', {}).get('type', 'all')
            
            if post_type == 'all':
                query = """
                    SELECT p.id, p.author_id, u.username, p.faction_id, f.name, 
                           p.title, p.content, p.post_type, p.created_at, p.updated_at
                    FROM posts p
                    LEFT JOIN users u ON p.author_id = u.id
                    LEFT JOIN factions f ON p.faction_id = f.id
                    ORDER BY p.created_at DESC
                """
                cursor.execute(query)
            else:
                query = """
                    SELECT p.id, p.author_id, u.username, p.faction_id, f.name, 
                           p.title, p.content, p.post_type, p.created_at, p.updated_at
                    FROM posts p
                    LEFT JOIN users u ON p.author_id = u.id
                    LEFT JOIN factions f ON p.faction_id = f.id
                    WHERE p.post_type = %s
                    ORDER BY p.created_at DESC
                """
                cursor.execute(query, (post_type,))
            
            posts = cursor.fetchall()
            
            cursor.close()
            conn.close()
            
            return make_response(200, {
                'posts': [{
                    'id': p[0],
                    'author_id': p[1],
                    'author_username': p[2],
                    'faction_id': p[3],
                    'faction_name': p[4],
                    'title': p[5],
                    'content': p[6],
                    'post_type': p[7],
                    'created_at': str(p[8]),
                    'updated_at': str(p[9])
                } for p in posts]
            })
        
        elif method == 'POST' and path == 'create':
            body = json.loads(event.get('body', '{}'))
            author_id = body.get('author_id')
            title = body.get('title', '').strip()
            content = body.get('content', '').strip()
            post_type = body.get('post_type', 'general')
            faction_id = body.get('faction_id')
            
            if not author_id or not title or not content:
                return make_response(400, {'error': 'Author, title and content required'})
            
            cursor.execute(
                "INSERT INTO posts (author_id, title, content, post_type, faction_id) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (author_id, title, content, post_type, faction_id if faction_id else None)
            )
            post_id = cursor.fetchone()[0]
            conn.commit()
            
            cursor.close()
            conn.close()
            
            return make_response(200, {'success': True, 'id': post_id})
        
        elif method == 'GET' and path == 'stats':
            cursor.execute("SELECT key, value, updated_at FROM statistics")
            stats = cursor.fetchall()
            
            cursor.close()
            conn.close()
            
            return make_response(200, {
                'statistics': [{
                    'key': s[0],
                    'value': s[1],
                    'updated_at': str(s[2])
                } for s in stats]
            })
        
        elif method == 'PUT' and path == 'stats':
            body = json.loads(event.get('body', '{}'))
            key = body.get('key', '').strip()
            value = body.get('value', '').strip()
            
            if not key or not value:
                return make_response(400, {'error': 'Key and value required'})
            
            cursor.execute(
                "INSERT INTO statistics (key, value, updated_at) VALUES (%s, %s, %s) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at",
                (key, value, datetime.now())
            )
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
