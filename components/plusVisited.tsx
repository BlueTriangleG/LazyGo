import React from 'react';

const plusVisited = async (title: string, email: string) => {
  try {
    // 发起 GET 请求，通过 title 和 email 查询数据库
    const checkResponse = await fetch(`/(api)/VisitedPlaces?email=${email}&title=${title}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 解析响应结果
    const checkResult = await checkResponse.json();
    
    // 如果请求成功
    if (checkResponse.ok) {
      // 打印数据库查询到的结果
      console.log('Database query result:', checkResult);
      
      // 如果有数据返回，打印详细信息
      if (checkResult.length > 0) {
        console.log('Record found:', checkResult[0]);
        
        // 增加 visit_count
        const visitCount = checkResult[0].visit_count + 1;
        const id = checkResult[0].id; // 假设记录中有id字段
        console.log('Updated visit count:', visitCount);

        // 使用 DELETE 请求删除记录
        const deleteResponse = await fetch(`/(api)/VisitedPlaces?email=${email}&title=${title}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // 检查删除请求的响应
        if (deleteResponse.ok) {
          console.log('Record deleted successfully.');
          
          // 删除后重新插入一条数据，保持 email 和 title 不变，visit_count 更新
          const insertResponse = await fetch(`/(api)/VisitedPlaces`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              title,
              visit_count: visitCount,
            }),
          });

          // 检查插入请求的响应
          if (insertResponse.ok) {
            console.log('New record inserted successfully with updated visit count.');
          } else {
            const insertResult = await insertResponse.json();
            console.error('POST request failed:', insertResult);
          }

        } else {
          const deleteResult = await deleteResponse.json();
          console.error('DELETE request failed:', deleteResult);
        }

      } else {
        console.log('No record found for the given title and email');
      }
    } else {
      // 请求失败时打印错误信息
      console.error('GET request failed:', checkResult);
    }
  } catch (error) {
    // 捕获请求过程中的错误
    console.error('Error fetching data from the database:', error);
  }
};

export default plusVisited;
