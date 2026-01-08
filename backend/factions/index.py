import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    '''API управления фракциями'''
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
        
        if method == 'GET' and path == 'list':
            cursor.execute(
                "SELECT id, name, type, is_open, general_username, description, created_at FROM factions ORDER BY type, name"
            )
            factions = cursor.fetchall()
            
            cursor.close()
            conn.close()
            
            return make_response(200, {
                'factions': [{
                    'id': f[0],
                    'name': f[1],
                    'type': f[2],
                    'is_open': f[3],
                    'general_username': f[4],
                    'description': f[5],
                    'created_at': str(f[6])
                } for f in factions]
            })
        
        elif method == 'POST' and path == 'create':
            body = json.loads(event.get('body', '{}'))
            name = body.get('name', '').strip()
            faction_type = body.get('type', 'open')
            is_open = body.get('is_open', True)
            description = body.get('description', '')
            
            if not name:
                return make_response(400, {'error': 'Faction name required'})
            
            cursor.execute(
                "INSERT INTO factions (name, type, is_open, description) VALUES (%s, %s, %s, %s) RETURNING id",
                (name, faction_type, is_open, description)
            )
            faction_id = cursor.fetchone()[0]
            conn.commit()
            
            cursor.close()
            conn.close()
            
            return make_response(200, {'success': True, 'id': faction_id})
        
        elif method == 'PUT' and path == 'update':
            body = json.loads(event.get('body', '{}'))
            faction_id = body.get('faction_id')
            updates = body.get('updates', {})
            
            if not faction_id:
                return make_response(400, {'error': 'Faction ID required'})
            
            set_clauses = []
            values = []
            
            for key in ['name', 'type', 'is_open', 'general_username', 'description']:
                if key in updates:
                    set_clauses.append(f"{key} = %s")
                    values.append(updates[key])
            
            if not set_clauses:
                return make_response(400, {'error': 'No updates provided'})
            
            values.append(faction_id)
            query = f"UPDATE factions SET {', '.join(set_clauses)} WHERE id = %s"
            
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
